import * as madge from 'madge';
import * as nodePath from 'path';
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import * as pathResolve from 'resolve';
import * as jimp from 'jimp';
import { success } from './logger';
import { hook, HOOK_NAME } from './hook';
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
  mkdir,
} from './fs';
import {
  errorCatch,
  isRelativePath,
  replaceImport,
  getOnly,
} from './helper';
import {
  includeRe,
  excludeRes
} from './const';
import { TreeNode } from '../types';

const { join } = nodePath;

let treeNodes: TreeNode = {};

/**
 * 递归查找对象key对应的深层value
 * @param target
 * @param keys
 * @param output
 */
const filterObjectKeys = (
  target: TreeNode,
  keys: string[],
  output: TreeNode,
): TreeNode => {
  if (Array.isArray(keys)) {
    keys.forEach((key) => {
      if (output[key]) {
        return;
      }
      output[key] = target[key] || [];
      filterObjectKeys(target, target[key], output);
    });
  }
  return output;
};

/**
 * 寻找真实路径（项目目录、node_modules）
 * @param rootPath
 * @param npmPath
 * @param path
 * @param value
 */
export const getRealPath = (
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
 * 循环替换
 * @param origin
 * @param replacer
 */
const getReplaceValue = (origin: string, replacer: string[][]) => {
  return replacer.reduce((res, [match, replacement]) =>
    res.replace(match, replacement)
  , origin);
};

/**
 * 读取ast上的import
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

/**
 * 递归找深层节点
 * @param re
 * @param input
 * @param cach
 * @param times
 */
const recurseNode = (
  re: RegExp,
  input: string[],
  cach: string[],
  times = 8,
) => {
  if (!times) return;
  input.forEach((val) => {
    if (re.test(val)) {
      if (cach.includes(val)) return;
      return cach.push(val);
    }
    if (!Array.isArray(treeNodes[val])) return;
    recurseNode(re, treeNodes[val], cach, times - 1);
  });
  return cach;
};

/**
 * 解析.vue
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
 * 解析.ts/.js
 * @param rootPath
 * @param npmPath
 * @param suffix
 */
const searchJsFiles = (
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
 * 找到文件夹下所有目标文件（vue、js）生成简易依赖树
 * @param rootPath
 * @param npmPath
 * @param option
 */
export const searchAllFiles = (
  rootPath: string,
  npmPath: string,
  option: {
    vue: RegExp;
    js: RegExp;
  }
) => {
  success('寻找.vue、.ts、.js文件中...');
  const { vue, js } = option;
  searchVueFiles(rootPath, npmPath, [vue]);
  searchJsFiles(rootPath, npmPath, [js]);
  return treeNodes;
};

/**
 * 递归查找所有.vue文件
 * @param re
 */
export const filterVueFiles = (re: RegExp | RegExp[]) => {
  success('过滤.vue文件中...');
  let [keyRe, valueRe] = [includeRe, includeRe];
  if (Array.isArray(re)) {
    [keyRe = includeRe, valueRe = keyRe] = re;
  } else if (re) {
    keyRe = re;
    valueRe = re;
  }
  const result: TreeNode = {};
  // 提取所有带.vue或目标的key
  Object.keys(treeNodes).forEach((key) => {
    if (keyRe.test(key)) {
      result[key] = treeNodes[key];
    }
  });

  Object.keys(result).forEach((key) => {
    const value = result[key];
    const tempValue: string[] = [];
    // 递归查询.vue文件引用.vue文件的情况
    recurseNode(valueRe, value, tempValue);
    result[key] = tempValue;
  });
  treeNodes = hook.callIterateSync(HOOK_NAME.FILTER_TREE_UPDATE, result) || result;
  return result;
};

/**
 * 美化路径
 * @param replacer
 */
export const prettifyFiles = (
  replacer: string[][],
) => {
  success('美化路径中...');
  const result: TreeNode = {};
  Object.keys(treeNodes).forEach((key) => {
    result[getReplaceValue(key, replacer)] = treeNodes[key].map(
      val => getReplaceValue(val, replacer)
    );
  });
  treeNodes = result;
  return result;
};

/**
 * 冗余组件
 * @param path
 * @param option
 */
export const searchRedundantComp = (
  path: string,
  option: { exclude: RegExp[] }
) => {
  const { exclude = excludeRes } = option;
  const result: string[] = [];
  Object.keys(treeNodes).forEach((key) => {
    if (exclude.some(re => re.test(key))) {
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
  write(path, JSON.stringify(result, null, 2));
  return result;
};

/**
 *统计数据
 */
export const statisticData = (routerPath: string) => {
  const list = [...new Set(treeNodes[routerPath])];
  const pageCount = list.length;
  const compCount = Object.keys(treeNodes).length - pageCount;
  success(`页面共: ${pageCount}`);
  success(`组件共: ${compCount}`);
  return {
    page: pageCount,
    component: compCount,
  };
};

/**
 *按页面模块画依赖图
 * @param to
 */
export const drawSplitDependencyImage = async (
  to: string,
  routerPath?: string,
) => {
  let list;

  if (typeof routerPath === 'string') {
    list = [...new Set(treeNodes[routerPath])] as string[];
  } else {
    list = Object.keys(treeNodes);
  }

  mkdir(to);
  for (const item of list) {
    success(`找到页面模块 => ${item}`);
    /**
     * 如果指定了节点key，需要递归遍历找到新的节点树，
     * 否则，直接返回节点key对应的子节点即可
     */
    const newTreeNodes: TreeNode = typeof routerPath === 'string'
      ? filterObjectKeys(treeNodes, [item], {})
      : { [item]: treeNodes[item] };

    const finalPath = `${to}/${
      item.replace(/(?:\.vue$|\.[jt]sx?$|[@~]?\/?(module|view|page)s?\/)/g, '')
        .replace(/\//g, '_')
    }.png`;
    await drawDependencyImage(finalPath, { node: newTreeNodes });
  }
};

/**
 * 画整体依赖图
 * @param to
 */
export const drawDependencyImage = async (
  to: string,
  options: { compressPath?: string; node?: TreeNode },
) => {
  const { compressPath, node } = options;
  success(`生成图片 => ${to}`);
  const result = await madge('.');
  result.tree = node || treeNodes;
  await result.image(to);
  // 按需压缩图片
  if (compressPath) {
    minifyImage(to, compressPath);
  }
};

/**
 *压缩图片中
 * @param from
 * @param to
 */
export const minifyImage = (
  from: string,
  to: string,
) => {
  success(`压缩图片 => ${to}`);
  jimp.read(from)
    .then(res => {
      return res.quality(50)
        .write(to);
    });
};
