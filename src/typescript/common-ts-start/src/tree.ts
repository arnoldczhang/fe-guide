import * as madge from 'madge';
import * as nodePath from 'path';
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import * as pathResolve from 'resolve';
import * as chalk from 'chalk';
import * as jimp from 'jimp';
import {
  parseVue,
  transferJsToAst,
  traverseBabelAst,
} from './transfer';
import {
  read,
  readdir,
  write,
  getFilePath,
} from './fs';
import {
  errorCatch,
  isDeclaration,
  isRelativePath,
  replaceImport,
  getOnly,
  genTreeMap,
} from './helper';

const { join } = nodePath;

let treeNodes: Record<string, string[]> = {};

/**
 *
 * @param rootPath
 * @param npmPath
 * @param path
 * @param value
 */
const getRealPath = (
  rootPath: string,
  npmPath: string,
  path: string,
  value: string,
) => {
  let realPath = isRelativePath(value) ? join(path, '..', value) : replaceImport(value, rootPath);
  try {
    // 开发文件
    if (!realPath.indexOf(rootPath)) {
      realPath = getFilePath(realPath);
      // node_modules
    } else {
      realPath = pathResolve.sync(realPath, { basedir: npmPath });
    }
  } catch(err) {
  } finally {
    return realPath;
  }
};

/**
 *
 * @param origin
 * @param replacer
 */
const getReplaceValue = (origin: string, replacer: string[][]) => {
  return replacer.reduce((res, [match, replacement]) =>
    res.replace(match, replacement)
  , origin);
};

/**
 *
 * @param rootPath
 * @param npmPath
 * @param path
 * @param content
 */
const traverseAst = (
  rootPath: string,
  npmPath: string,
  path: string,
  content: string,
) => {
  const babelAst = transferJsToAst(content);
  traverseBabelAst(babelAst, {
    /**
     * 处理：
     * - import('xxx')
     * @param p
     */
    CallExpression(p: NodePath<t.CallExpression>) {
      if (p.get('callee').type === 'Import') {
        const [arg] = p.get('arguments');
        const value = getOnly(arg.get('value')).node;
        treeNodes[path].push(getRealPath(
          rootPath,
          npmPath,
          path,
          String(value),
        ));
      }
    },
    /**
       * 处理两种形式：
       * - import xxx from 'xxxpath';
       * - import from 'xxxpath';
       *
       * @param p
       */
    ImportDeclaration(p: NodePath<t.ImportDeclaration>) {
      const sourceValue = getOnly(p.get('source.value'));
      const { node: value } = sourceValue;
      if (typeof value !== 'string') return;
      treeNodes[path].push(getRealPath(
        rootPath,
        npmPath,
        path,
        value,
      ));
    },
  });
};

const recurseNode = (
  re: RegExp,
  input: string[],
  cach: string[],
  times = 5,
) => {
  if (!times) return;
  input.forEach((val) => {
    if (re.test(val)) return cach.push(val);
    if (!Array.isArray(treeNodes[val])) return;
    recurseNode(re, treeNodes[val], cach, times - 1);
  });
  return cach;
};

/**
 *
 */
const searchVueFiles = errorCatch((
  rootPath: string,
  npmPath: string,
  suffix: RegExp[],
) => {
  const targetPaths = readdir(rootPath, { suffix });
  targetPaths.forEach((path: string) => {
    treeNodes[path] = [];
    const vueContent = read(path);
    const { script } = parseVue(vueContent);
    if (!script) return;
    const { content, attrs } = script;

    if (attrs && attrs.src) {
      const { src } = attrs;
      return treeNodes[path].push(join(path, '..', src));
    }

    traverseAst(
      rootPath,
      npmPath,
      path,
      content,
    );
  });
});

/**
 *
 * @param rootPath
 * @param npmPath
 * @param suffix
 */
const searchjsFiles = (
  rootPath: string,
  npmPath: string,
  suffix: RegExp[],
) => {
  const targetPaths = readdir(rootPath, { suffix });
  targetPaths.forEach((path: string) => {
    treeNodes[path] = [];
    const content = read(path);
    traverseAst(
      rootPath,
      npmPath,
      path,
      content,
    );
  });
};

/**
 *
 * @param rootPath
 * @param npmPath
 * @param option
 */
export const searchAllFiles = (
  rootPath: string,
  npmPath: string,
  option: {
    vue: RegExp[];
    js: RegExp[];
  }
) => {
  console.log(chalk.green('寻找.vue、.ts、.js文件中'));
  const { vue, js } = option;
  searchVueFiles(rootPath, npmPath, vue);
  searchjsFiles(rootPath, npmPath, js);
};

/**
 *
 * @param re
 */
export const filterVueFiles = (re: RegExp) => {
  console.log(chalk.green('过滤.vue文件中'));
  const result: Record<string, string[]> = {};
  // 提取所有带.vue的key
  Object.keys(treeNodes).forEach((key) => {
    if (re.test(key)) {
      result[key] = treeNodes[key];
    }
  });

  Object.keys(result).forEach((key) => {
    const value = result[key];
    const tempValue: string[] = [];
    // 递归查询.vue文件引用.vue文件的情况
    recurseNode(re, value, tempValue);
    result[key] = tempValue;
  });
  treeNodes = result;
};

/**
 *
 * @param replacer
 */
export const prettifyFiles = (
  replacer: string[][],
) => {
  console.log(chalk.green('美化路径中'));
  const result: Record<string, string[]> = {};
  Object.keys(treeNodes).forEach((key) => {
    result[getReplaceValue(key, replacer)] = treeNodes[key].map(
      val => getReplaceValue(val, replacer)
    );
  });
  treeNodes = result;
};

/**
 *
 * @param path
 * @param option
 */
export const searchRedundantComp = (
  path: string,
  option: { skip: RegExp[] }
) => {
  const { skip } = option;
  const result: string[] = [];
  Object.keys(treeNodes).forEach((key) => {
    if (skip.some(re => re.test(key))) {
      return;
    }

    const used = Object.keys(treeNodes).some((otherKey) => {
      if (otherKey === key) return;
      if (treeNodes[otherKey].includes(key)) {
        return true;
      }
    });

    if (!used) {
      result.push(key);
    }
  });
  write(path, JSON.stringify(result));
};

/**
 *
 * @param to
 */
export const drawDependencyImage = async (
  to: string,
  miniTo: string,
) => {
  console.log(chalk.green('生成图片中'));
  const result = await madge('.');
  result.tree = treeNodes;
  await result.image(to);
  console.log(chalk.green('压缩图片中'));
  jimp.read(to)
    .then(res => {
      return res.quality(50)
        .write(miniTo);
    });
};