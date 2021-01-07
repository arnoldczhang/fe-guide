import * as nodePath from 'path';
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import {
  VueResult,
  PathInfo,
} from './types';
import {
  AST,
} from 'vue-eslint-parser';
import {
  SFCBlock,
  compile,
} from 'vue-template-compiler';
import {
  parseVue,
  transferJsToAst,
  traverseBabelAst,
  babelGenerate,
  transferVueTemplateToAst,
  transferLessToCss,
  transferCssToAst,
  transferTs2js,
  traverseVueTemplateAst,
  getBlockAttrs,
} from './transfer';
import {
  read,
  write,
  readdir,
  copy,
  cleardir,
} from './fs';
import {
  errorCatch,
  isDeclaration,
  isRelativePath,
  getReadmeTemplate,
  toLineLetter,
  genVueResult,
} from './helper';
import {
  ImportDeclaration,
  ExportDefaultDeclaration,
  CallExpression,
} from './babel';
import * as chalk from 'chalk';

const { join } = nodePath;
// 所有文件的各自依赖情况
const pathCach = new Map();
// 所有组件的父组件情况
const compCach = new Map();

const traverseJs = errorCatch((
  content: string,
  pathInfo: PathInfo,
  result: VueResult,
): VueResult => {
  const babelAst = transferJsToAst(content);
  traverseBabelAst(babelAst, {
    /**
     * 动态import
     *
     * - 暂不处理
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
}, 'traverseJs');

const traverseVue = errorCatch((
  tpl: string,
  path: string,
  result: VueResult,
) => {
  const ast = transferVueTemplateToAst(tpl);
  traverseVueTemplateAst(ast, {
    VElement(
      node: AST.VElement,
    ) {
      const { rawName, startTag } = node;
      const { component, template } = result;
      if (!component.has(rawName)) return;
      const {
        range: [start, end],
      } = startTag;
      const value = template.get(rawName) || new Set();
      value.add(tpl.substring(start, end));
      template.set(rawName, value);
    },
  });
  return result;
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
  } = pathInfo;
  const targetPaths = readdir(rootPath, { suffix });
  targetPaths.forEach((path: string) => {
    console.log(chalk.green(`now update file: ${path}`));
    const content = read(path);
    const { template, script, styles } =  parseVue(content);
    const result = genVueResult();
    // 生成js转ast，生成特定树
    let jsContent = '';
    if (script) {
      const { content, attrs } = script;
      let current = path;
      let tempContent = content;
      if (attrs && attrs.src) {
        result.src = join(path, '..', attrs.src);
        current = result.src;
        tempContent = read(current);
        pathCach.set(current, result);
      }
      traverseJs(tempContent, { ...pathInfo, current }, result);
      jsContent = `<script ${getBlockAttrs(attrs)}>
        ${content}
        </script>
      `;
    }
    // html转ast，完善树内容
    let tplContent = '';
    if (template) {
      traverseVue(template, path, result);
      tplContent = template;
    }
    pathCach.set(path, result);
    // 每个less插入全局样式
    let styleContent  = '';
    if (styles && styles.length) {
      styleContent = styles.reduce((res: string, pre: SFCBlock) => {
        if (pre) {
          const { attrs, content } = pre;
          // 全局样式应该由全局引入
          // ${attrs.lang === 'less' ? '@import \'~@/style/layout.less\';' : ''}
          res += `<style ${getBlockAttrs(attrs)}>
            ${content}
            </style>
          `;
        }
        return res;
      }, '');
    }
    write(path, `${tplContent}
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
    root: rootPath,
  } = pathInfo;
  const targetPaths = readdir(rootPath, { suffix });
  targetPaths.forEach((path: string) => {
    if (isDeclaration(path)) return;
    console.log(chalk.green(`now update file: ${path}`));
    // .vue文件如果以外链方式注入js，两者公用cach，这里跳过即可
    if (pathCach.has(path)) return;
    const content = read(path);
    const result = genVueResult();
    traverseJs(content, { ...pathInfo, current: path }, result);
    pathCach.set(path, result);
  });
});

/**
 * less/css处理
 * - @/style/theme/index.less需要头部强行插入layout.less（避免报错）
 */
const updateCssDependencies = errorCatch((
  rootPath: string,
  suffix: RegExp[],
) => {
  console.log(chalk.green('now update less/css files'));
  const targetPaths = readdir(rootPath, { suffix });
  targetPaths.forEach((path: string) => {
    if (path.indexOf('style/theme/index.less') !== -1) {
      const content = read(path);
      write(path, `
        @import '~@/style/layout.less';
        ${content}
      `);
    }
  });
});

/**
 * 清空components下内容
 * @param path string
 */
export const startGenerate = (
  path: string,
): void => cleardir(path);

/**
 * 复制src下文件到components
 */
export const copyOriginToVuepress = errorCatch((
  from: string,
  to: string,
) => {
  const pathArr = readdir(from, {
    deep: false,
    absolute: false,
    suffix: [],
    // suffix: [/\.(?:[jt]s|vue|(c|le)ss)$/],
  });
  pathArr.forEach((p: string) => {
    copy(join(from, p), join(to, p));
  });
});

/**
 * 更新js/less/vue文件内容
 * @param rootPath string
 * @param option string
 */
export const updateDependencies = (
  pathInfo: PathInfo,
  option: {
    vue: RegExp[];
    js: RegExp[];
    css: RegExp[];
  },
) => {
  const { vue, js, css } = option;
  updateVueDependencies(pathInfo, vue);
  updateJsDependencies(pathInfo, js);
  updateCssDependencies(pathInfo.root, css);
};

/**
 * 找到各个组件的父引用
 */
export const updateComponentUsageFromImport = errorCatch((
  vuepressPath: string,
  vueRe: RegExp
) => {
  console.log(chalk.green('now update component usage from import'));
  const keys = pathCach.keys();
  [...keys].forEach((key) => {
    const {
      import: importDependency,
      template,
    } = pathCach.get(key);
    if (importDependency.size) {
      [...importDependency.keys()].forEach((dKey) => {
        const compPath = importDependency.get(dKey);
        if (!vueRe.test(compPath)) return;
        const originValue = compCach.get(compPath) || new Set();
        const lineDKey = toLineLetter(dKey);
        originValue.add({
          path: key,
          relativePath: key.replace(`${vuepressPath}/`, ''),
          usage: {
            [dKey]: template.get(dKey),
            [lineDKey]: template.get(lineDKey)
          },
        });
        compCach.set(compPath, originValue);
      });
    }
  });
});

/**
 * 组件循环插入 vupress 页面
 */
export const iterateInsertCompToVupress = errorCatch((
  vuepressPath: string,
  outFile: string,
) => {
  console.log(chalk.green('now update mock data'));
  let result = '';
  [...compCach.keys()].forEach((key) => {
    const compInfo = pathCach.get(key);
    const parentInfo = compCach.get(key);
    let compTitle = compInfo.data.get('name');
    // 如果组件未设置name，从引用处获取第一个importName
    if (!compTitle && parentInfo.size) {
      const [{
        usage,
      }] = [...parentInfo];
      compTitle = Object.keys(usage)[0];
    }
    // 组件名转为vuepress特定名
    const compName = key
      .replace(`${vuepressPath}/`, '')
      .replace(/\//g, '-')
      .replace(/\.vue$/, '');
    const compProp = compInfo.prop;
    result += getReadmeTemplate({
      title: compTitle,
      name: compName,
      prop: compProp,
      parent: parentInfo,
    });
  });
  write(outFile, result);
});

/**
 *
 */
export const finishGenerate = errorCatch(() => {
  console.log('todo');
});