import * as nodePath from 'path';
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import {
  VueResult,
} from './types';
import {
  GeneratorResult,
} from '@babel/generator';
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
  replaceImport,
  getOnly,
  genTreeMap,
} from './helper';
import {
  ImportDeclaration,
  ExportDefaultDeclaration,
  CallExpression,
} from './babel';
import * as chalk from 'chalk';

const { join } = nodePath;

const traverseJs = errorCatch((
  content: string,
  path: string,
): VueResult => {
  const result: VueResult = {
    import: new Map(),
    component: new Map(),
    data: new Map(),
  };
  const babelAst = transferJsToAst(content);
  traverseBabelAst(babelAst, {
    /**
     * 动态import
     *
     * - 暂不处理
     * @param p
     */
    CallExpression(p: NodePath<t.CallExpression>) {
      errorCatch(CallExpression)(p);
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
      errorCatch(ImportDeclaration)(p, result, path);
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
  template: string,
  rootPath: string,
) => {
  // console.log(template);
});

/**
 * vue的处理
 * - 提取所有data/props/computed(若可以)
 * - <style>头部插入~@/style/layout.less
 * - <template>提取组件的调用
 */
const updateVueDependencies = errorCatch((
  rootPath: string,
  suffix: RegExp[],
) => {
  const targetPaths = readdir(rootPath, { suffix });
  const pathCach = new Map();
  targetPaths.slice().forEach((path: string) => {
    console.log(chalk.green(`now update file: ${path}`));
    const content = read(path);
    let tplContent = '';
    let jsContent = '';
    let styleContent  = '';
    const { template, script, styles } =  parseVue(content);
    // js
    if (script) {
      const { content, attrs } = script;
      const cach = traverseJs(content, rootPath);
      pathCach.set(path, cach);
      jsContent = `<script ${getBlockAttrs(attrs)}>
        ${content}
        </script>
      `;
    }
    //
    if (template) {
      traverseVue(template, path);
      tplContent = template;
    }
    // less
    if (styles && styles.length) {
      styleContent = styles.reduce((res: string, pre: SFCBlock) => {
        if (pre) {
          const { attrs, content } = pre;
          res += `<style ${getBlockAttrs(attrs)}>
            ${attrs.lang === 'less' ? '@import \'~@/style/layout.less\';' : ''}
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
  genTreeMap(pathCach);
});

/**
 * ts/js的处理
 * - 提取所有data/props/computed(若可以)
 */
const updateJsDependencies = errorCatch((
  rootPath: string,
  suffix: RegExp[],
) => {
  const targetPaths = readdir(rootPath, { suffix });
  targetPaths.forEach((path: string) => {
    if (isDeclaration(path)) return;
    console.log(chalk.green(`now update file: ${path}`));
    const content = read(path);
    traverseJs(content, rootPath);
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
  rootPath: string,
  option: {
    vue: RegExp[];
    js: RegExp[];
    css: RegExp[];
  }
) => {
  const { vue, js, css } = option;
  updateVueDependencies(rootPath, vue);
  // updateJsDependencies(rootPath, js);
  // updateCssDependencies(rootPath, css);
};

export const updateMockData = errorCatch(() => {
  console.log('todo');
});

export const iterateInsertCompToVupress = errorCatch(() => {
  console.log('todo');
});

export const finishGenerate = errorCatch(() => {
  console.log('todo');
});