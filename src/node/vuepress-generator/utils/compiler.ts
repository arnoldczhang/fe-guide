import * as nodePath from 'path';
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import {
  AST,
} from 'vue-eslint-parser';
import {
  SFCBlock,
} from 'vue-template-compiler';
import Visitor from '@swc/core/Visitor';
import swcCore from '@swc/core';
import {
  VueResult,
  PathInfo,
  Reg,
  Entry,
  Output,
  CompResult,
  ModuleInfo,
} from '../types';
import { success } from './logger';
import { hook, HOOK_NAME } from './hook';
import {
  parseVue,
  transferJsToAst,
  transferJsToSwcAst,
  traverseSwcAst,
  traverseBabelAst,
  transferVueTemplateToAst,
  traverseVueTemplateAst,
} from './transfer';
import {
  read,
  write,
  readdir,
  copy,
  cleardir,
  remove,
  exist,
  mkdir,
} from './fs';
import {
  errorCatch,
  isDeclaration,
  genReadmeTemplate,
  toLineLetter,
  toCamelLetter,
  hasLineLetter,
  genVueResult,
  genVuepressCompName,
  genVuepressCompTitle,
  genVuepressMdName,
  genCompResult,
  genCategoryPath,
  concatObjectKeyValue,
  checkConfigContentValid,
  getFileAuthor,
  genConfigStruct,
  deduplicate,
} from './helper';
import {
  ImportDeclaration,
  ExportDefaultDeclaration,
  CallExpression,
} from './babel';
import {
  visitCallExpression,
  visitImportDeclaration,
  visitExportDefaultDeclaration,
} from './swc';
import {
  jsRe,
  vueRe,
  lessRe,
  defaultModuleInfoKey,
} from './const';

const { join } = nodePath;
// 所有文件（.vue、.js、.ts）的各自依赖情况
const pathCach: Map<string, VueResult> = new Map();
// 全局组件情况
const globalCompCach: Map<string, string> = new Map();
// 所有组件的父组件（信息、路径等）情况
const compCach: Map<string, Set<CompResult>> = new Map();
// 外部配置文件情况
let configCach: Record<string, ModuleInfo> | undefined = undefined;

const globalCach = { pathCach, compCach };

/**
 * traverseJs
 */
const traverseJs = errorCatch((
  content: string,
  pathInfo: PathInfo,
  result: VueResult,
): VueResult => {
  const babelAst = transferJsToAst(content);
  traverseBabelAst(babelAst, {
    /**
     * 处理两种情况
     *
     * - import()
     * - Vue.extend
     *
     * @param p
     */
    CallExpression(p: NodePath<t.CallExpression>) {
      errorCatch(CallExpression)(p, result, pathInfo);
    },
    /**
     * 记录xxx和xxxpath绝对路径映射
     *
     * 处理两种形式：
     * - import xxx from 'xxxpath';
     * - import from 'xxxpath';
     *
     * @param p
     */
    ImportDeclaration(p: NodePath<t.ImportDeclaration>) {
      errorCatch(ImportDeclaration)(p, result, pathInfo);
    },
    /**
     * 处理vue初始化对象
     *
     * - export default class xx extends Vue {}
     * - export default {}
     *
     * @param p
     */
    ExportDefaultDeclaration(p: NodePath<t.ExportDefaultDeclaration>) {
      errorCatch(ExportDefaultDeclaration)(p, result, content);
    },
  });
  return result;
}, {
  fnName: 'traverseJs',
});

/**
 * TODO traverseJsBySwc
 */
export const traverseJsBySwc = errorCatch((
  content: string,
  pathInfo: PathInfo,
  result: VueResult,
): VueResult => {
  const babelAst = transferJsToSwcAst(content);
  class NewVisitor extends Visitor {
    visitCallExpression(p: swcCore.CallExpression): swcCore.Expression {
      errorCatch(visitCallExpression)(p, result, pathInfo);
      return p;
    }
    ImportDeclaration(p: swcCore.ImportDeclaration) {
      errorCatch(visitImportDeclaration)(p, result, pathInfo);
    }
    ExportDefaultDeclaration(p: swcCore.ExportDefaultDeclaration) {
      errorCatch(visitExportDefaultDeclaration)(p, result, content);
    }
  }
  traverseSwcAst(babelAst, NewVisitor);
  return result;
}, {
  fnName: 'traverseJsBySwc',
});

/**
 * traverseVueTemplate
 */
const traverseVueTemplate = errorCatch((
  tpl: string,
  path: string,
  result: VueResult,
) => {
  if (!tpl) return result;
  const ast = transferVueTemplateToAst(tpl);
  traverseVueTemplateAst(ast, {
    VElement(
      node: AST.VElement,
    ) {
      const { rawName, startTag, endTag, loc } = node;
      const { component, template, location } = result;
      /**
       * 如果当前节点不符合当前引用的组件和全局组件的名称，
       * 则判定为纯html标签
       */
      if (
        !component.has(rawName)
          && !globalCompCach.has(rawName)
      ) return;
      const {
        range: [start, end],
      } = startTag;
      const {
        range,
      } = endTag || { range: [0, 0] };
      const value = template.get(rawName) || new Set();
      const targetTpl = tpl.substring(start, end) + tpl.substring(range[0], range[1]);
      value.add(targetTpl);
      const { start: starLoc, end: endLoc } = loc;
      location.set(targetTpl, [starLoc.line, endLoc.line]);
      template.set(rawName, value);
    },
  });
  return result;
});

/**
 * 更新vue上的<style />标签内容
 * @param styles
 */
const updateStyleContent = errorCatch((styles: SFCBlock[]) => {
  if (styles && styles.length) {
    return styles.reduce((res: string, pre: SFCBlock) => {
      if (pre) {
        const { attrs, content } = pre;
        // 全局样式应该由全局引入
        const extraContent = hook.callIterateSync(
          HOOK_NAME.beforeIterateInsertVueStyle,
          attrs,
          globalCach,
        ) || '';

        res += `<style${concatObjectKeyValue(attrs)}>
          ${extraContent}
          ${content}
          </style>
        `;
      }
      return res;
    }, '');
  }
  return '';
});

/**
 * 更新vue上的<script /> 内容
 * @param path
 * @param script
 * @param pathInfo
 * @param result
 */
const updateScriptContent = errorCatch((
  path: string,
  script: SFCBlock,
  pathInfo: PathInfo,
  result: VueResult,
) => {
  if (!script) return { jsContent: '', compResult: result };
  const { content, attrs = {} } = script;
  const {
    root: rootPath,
    vuepress,
  } = pathInfo;
  let current = path;
  let tempJsContent = content;
  // 外链脚本需要通过src获取源文件内容后解析
  if (attrs && attrs.src) {
    result.src = join(path, '..', attrs.src);
    // 外链ts/js需要合并统计开发人员
    result.author = [...new Set([...result.author || [], ...getFileAuthor(rootPath, vuepress, result.src)])];
    current = result.src;
    delete attrs.src;
    const tempResult = pathCach.get(current);

    if (typeof tempResult === 'undefined') {
      throw new Error(`找不到 ${path} 对应的外部脚本：${current}`);
    }

    tempJsContent = read(current);
    // 这里需要删除原文件，避免vuepress默认使用.ts/.js
    remove(current);
    const { src, author, short } = result;
    result = {
      ...tempResult,
      src,
      author,
      path: result.path,
      short,
    };
  // 非外链脚本，直接获取内容解析即可
  } else {
    traverseJs(tempJsContent, {
      ...pathInfo,
      global: globalCompCach,
      current,
    }, result);
  }

  const jsContent = `<script${concatObjectKeyValue(attrs)}>
${tempJsContent}
      </script>
    `;

  return {
    jsContent,
    compResult: result,
  };
});

/**
 * vue的处理
 * - 提取所有data/props/computed(若可以)
 * - <template>提取组件的调用
 * - <style>头部插入~@/style/layout.less
 * - 更新依赖树
 */
const updateVueDependencies = errorCatch((
  pathInfo: PathInfo,
  suffix: RegExp[],
) => {
  const {
    root: rootPath,
    vuepress,
  } = pathInfo;
  const targetPaths = readdir(vuepress, { suffix });
  targetPaths.forEach((path: string) => {
    success(`now update file: ${path}`);
    const content = read(path);
    const { template, script, styles } =  parseVue(content);
    const result = genVueResult();
    // 设置配置文件基本信息
    result.author = getFileAuthor(rootPath, vuepress, path);
    result.path = path.replace(vuepress, '');
    result.short = path.replace(vuepress, '@');
    // 生成js转ast，生成特定树
    const { jsContent, compResult } = updateScriptContent(path, script, pathInfo, result);
    // template转 ast 做遍历处理
    traverseVueTemplate(template, path, compResult);
    // less可能要做内容变更（比如插入全局less）
    const styleContent  = updateStyleContent(styles);
    // 更新缓存
    pathCach.set(path, compResult);
    write(path, `${template}
${jsContent}
${styleContent}
    `);
  });
});

/**
 * ts/js的处理
 * - 提取所有data/props/computed(若可以)
 */
const updateJsDependencies = errorCatch((
  pathInfo: PathInfo,
  suffix: RegExp[],
) => {
  const {
    vuepress,
  } = pathInfo;
  const targetPaths = readdir(vuepress, { suffix });
  targetPaths.forEach((path: string) => {
    if (isDeclaration(path)) return;
    success(`now update file: ${path}`);
    const content = read(path);
    const result = genVueResult();
    traverseJs(content, {
      ...pathInfo,
      global: globalCompCach,
      current: path,
    }, result);
    pathCach.set(path, result);
  });
});

/**
 * less/css处理
 */
const updateCssDependencies = errorCatch((
  rootPath: string,
  suffix: RegExp[],
) => {
  success('now update less/css files');
  const targetPaths = readdir(rootPath, { suffix });
  targetPaths.forEach((path: string) => {
    const content = hook.callIterateSync(HOOK_NAME.beforeIterateInsertLess, path, { read }, globalCach) || read(path);
    write(path, content);
  });
});

/**
 * 清空制定目录下的内容包括文件夹
 * @param path string
 */
export const clearEntryPath = errorCatch((
  pathArray: string[],
): void => {
  pathArray.forEach((path) => {
    success(`now clear path: ${path}`);
    cleardir(path, false);
    mkdir(path);
  });
});

/**
 * 复制src下文件到components
 */
export const copyOriginToVuepress = errorCatch((
  from: string,
  to: string,
) => {
  const pathArray = readdir(from, {
    deep: false,
    absolute: false,
    suffix: [],
  });

  pathArray.forEach((p: string) => {
    success(`now copy path: ${p}`);
    copy(join(from, p), join(to, p));
  });
});

/**
 * 按需更新配置文件
 * @param configFile
 */
export const updateLocalConfig = errorCatch((configFile?: string) => {
  if (!configFile) {
    return;
  }

  try {
    if (exist(configFile)) {
      const content = JSON.parse(read(configFile));
      if (content && typeof content === 'object') {
        configCach = checkConfigContentValid(content);
      }
      return configCach;
    } else {
      write(configFile, '');
      configCach = {};
    }
  } catch (e) {
    configCach = {};
  }
});

/**
 * 更新js/less/vue文件内容
 * @param rootPath string
 * @param option string
 */
export const updateDependencies = errorCatch((
  pathInfo: PathInfo,
  option?: Reg,
) => {
  const {
    vue = vueRe,
    js = jsRe,
    less = lessRe,
  } = option || {};
  updateJsDependencies(pathInfo, [js]);
  updateVueDependencies(pathInfo, [vue]);
  updateCssDependencies(pathInfo.vuepress, [less]);
});

/**
 * 提取组件的引用关系
 */
export const updateComponentUsageFromImport = errorCatch((
  entry: Entry,
  vuepressPath: string,
  vueRe: RegExp
) => {
  const { src: originPath, gitlab } = entry;
  const globalCompSize = globalCompCach.size;
  success('now update component usage from import');
  [...pathCach.keys()].forEach((key) => {
    if (!vueRe.test(key)) return;
    const {
      import: importDependency,
      component,
      template,
      location,
    } = pathCach.get(key) as VueResult;
    // 如果当前组件有引用外部组件，或至少有全局组件
    if (component.size || globalCompSize) {
      // 记录已经统计过的组件名
      const added: string[] = [];
      // 全局+文件组件名去重
      const dedupKeys = deduplicate([
        ...globalCompCach.keys(),
        ...component.keys(),
      ]);

      dedupKeys.forEach((dKey) => {
        if (added.includes(dKey)) {
          return;
        }
        // 当前文件引用的子组件，优先级高于同名全局组件
        const compPath = importDependency.get(dKey) || globalCompCach.get(dKey);
        // 这里只处理.vue文件的依赖，其他不管
        if (!vueRe.test(compPath)) return;
        const originValue = compCach.get(compPath) || genCompResult();
        const lineDKey = hasLineLetter(dKey) ? toCamelLetter(dKey) : toLineLetter(dKey);
        const tpl = template.get(dKey);
        const lineTpl = template.get(lineDKey);
        added.push(dKey);
        added.push(lineDKey);

        const unUsed = !tpl && !lineTpl;
        const isCurrComp = component.has(dKey) || component.has(lineDKey);
        const isGlobal = globalCompCach.has(dKey) || globalCompCach.has(lineDKey);
        /**
         * 如果当前.vue中没有使用到 import 的组件，
         * 而这个组件是全局组件，则视为正常（全局组件不用很正常），
         * 否则就要记录下来，视为当前文件的冗余组件引入
         */
        if (unUsed && !isCurrComp && isGlobal) {
          return;
        }

        originValue.add({
          path: key,
          gitlabPath: gitlab && key.replace(vuepressPath, gitlab),
          originPath: key.replace(vuepressPath, originPath),
          relativePath: key.replace(vuepressPath, '@'),
          location,
          usage: {
            [dKey]: tpl,
            [lineDKey]: lineTpl,
          },
        } as CompResult);
        compCach.set(compPath, originValue);
      });
    }
  });
});

/**
 * 组件循环插入 vupress 页面
 */
export const iterateInsertCompToVuepress = errorCatch((
  entry: Entry,
  output: Output,
) => {
  const {
    gitlab = '',
    src: originPath,
  } = entry;
  const {
    subDir: vuepressPath = '',
    dir: outpath,
  } = output;
  if (!outpath) return;
  success('now generate .md file to vuepress dir');
  mkdir(outpath);
  // 取配置缓存，需要拿组件分类信息
  const cach = configCach || {};
  [...compCach.keys()].forEach((key) => {
    const compInfo = pathCach.get(key);
    if (!compInfo) return;
    const localConfig = cach[compInfo.short || ''] || {};
    const {
      category = '',
    } = localConfig;
    const parentInfo = compCach.get(key) as Set<CompResult>;
    // 起组件名
    const title = genVuepressCompTitle(compInfo, parentInfo);
    // 更新组件名
    compInfo.name = title;
    // 起 vuepress 引用组件名
    const name = genVuepressCompName(vuepressPath || '', key);
    // 输出的 md 文件名
    let outputMdFile;
    // 如果有预配置的 category，需要先创建该文件夹，然后将md文件写入
    // 否则直接放在 outputMdFile 更目录即可
    if (category) {
      const parentPath = genCategoryPath(outpath, category);
      outputMdFile = genVuepressMdName(`${parentPath}/${title}.md`);
    } else {
      outputMdFile = genVuepressMdName(`${outpath}/${title}.md`);
    }

    // 允许指定部分组件跳过生成md文件
    if (
      hook.callIterateSync(
        HOOK_NAME.skipIterateGenMarkdown,
        compInfo,
        parentInfo,
        globalCach,
      )
    ) {
      return;
    }

    const mdFile = genReadmeTemplate({
      path: [
        key.replace(vuepressPath, '@'),
        key.replace(vuepressPath, originPath),
        gitlab && key.replace(vuepressPath, gitlab),
      ],
      title,
      name,
      compInfo,
      localConfig,
      parent: parentInfo,
    });

    // 生成readme文件
    write(outputMdFile, mdFile);
    success(`generate ${outputMdFile} success`);
    hook.callSync(HOOK_NAME.afterIterateGenMarkdown, outputMdFile, mdFile, globalCach);
  });
});

/**
 * 将vue文件拆分为html、css、js
 * @param dir
 */
export const splitVueToCommonFiles = errorCatch((dir: string) => {
  const targetPaths = readdir(dir, { suffix: [vueRe] });
  targetPaths.forEach((path: string) => {
    success(`now split file: ${path}`);
    const content = read(path);
    const { template, script, styles } =  parseVue(content);

    if (styles && styles.length) {
      styles.forEach((pre: SFCBlock, index: number) => {
        if (pre) {
          const { content } = pre;
          if (content) {
            write(path.replace(/\.vue$/, `-${index}.less`), content);
          }
        }
      });
    }

    if (script) {
      const { content, attrs = {} } = script;
      if (!attrs || !attrs.src) {
        write(path.replace(/\.vue$/, `.${attrs.lang || 'js'}`), content);
      }
    }

    if (template) {
      write(path.replace(/\.vue$/, '.html'), template);
    }
    remove(path);
  });
});

/**
 * vuepress收尾处理
 *
 * - 重新生成配置文件
 */
export const finishGenerate = errorCatch((configFile: string) => {
  success('generate success~~');
  success('now check if need to generate config file');
  if (!configFile) return;
  configCach = [...compCach.keys()].reduce((res, key) => {
    const comp = pathCach.get(key);
    if (typeof comp === 'undefined' || typeof configCach === 'undefined') {
      return res;
    }
    const { short = '' } = comp;
    // 从本次编译的信息中拿最新的组件信息
    const otherProps = defaultModuleInfoKey.reduce((res, key) => {
      if (key in comp) {
        res[key] = comp[key];
      }
      return res;
    }, {} as Record<string, any>);
    /**
     * 输出新的配置文件结构
     *
     * 因为考虑到组件更新，所以逻辑是：
     *
     * - 优先用默认结构填充
     * - 再用本次编译信息补充几个更新字段（author、name等）
     * - 最后用配置文件（若有）的字段填充
     *
     */
    res[short] = {
      ...genConfigStruct(),
      ...otherProps,
      ...configCach[short] || {},
    };
    return res;
  }, {} as Record<string, ModuleInfo>);
  configCach = hook.callIterateSync(HOOK_NAME.beforeGenConfigFile, configCach, globalCach) || configCach;
  write(configFile, JSON.stringify(configCach, null, 2));
  hook.callSync(HOOK_NAME.afterGenConfigFile, configFile, configCach, globalCach);
  success('generate config file success');
});