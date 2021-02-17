import {
  clearEntryPath,
  copyOriginToVuepress,
  updateDependencies,
  updateComponentUsageFromImport,
  iterateInsertCompToVuepress,
  finishGenerate,
  updateLocalConfig,
  splitVueToCommonFiles,
} from './utils/compiler';
import {
  analyseLessUsage,
  genLessUsageTree,
  replaceCommonLess,
} from './utils/less';
import {
  searchAllFiles,
  filterVueFiles,
  prettifyFiles,
  statisticData,
  drawSplitDependencyImage,
  drawDependencyImage,
  searchRedundantComp,
} from './utils/tree';
import {
  registerPlugins,
  assert,
  isStr,
  isRe,
  isObj,
} from './utils/helper';
import {
  vueRe,
  jsRe,
  lessRe,
} from './utils/const';
import {
  cleardir,
} from './utils/fs';
export { hook, HOOK_NAME } from './utils/hook';
import { TreeNode, FridayConfig } from './types';

/**
 * 查找目录下所有vue、js
 */
export const findAllFiles = (param: FridayConfig): TreeNode => {
  const {
    entry,
    regExp,
    plugin = [],
  } = param;
  registerPlugins(plugin);
  assert(isObj(entry), '需要传入 entry - 输入对象');
  const { src, node } = entry;
  assert(isStr(src), '需要传入 entry: { src } - 查找目录');
  assert(isStr(node), '需要传入 entry: { node } - node_modules目录');
  let { vue, js } = regExp || {};
  vue = vue || vueRe;
  assert(isRe(vue), 'regExp: { vue } - 查找.vue文件正则');
  js = js || jsRe;
  assert(isRe(js), 'regExp: { js } - 查找.js/.jsx/.ts/.tsx文件正则');
  return searchAllFiles(src, node, { vue, js });
};

/**
 * 查找目录下所有依赖关系，
 * 如果考虑router.ts或main.ts等入口文件，需要设置 include
 */
export const findAllFilesDependency = (param: FridayConfig): TreeNode => {
  findAllFiles(param);
  const {
    regExp,
    prettyList,
  } = param;
  const { include } = regExp || {};

  if (typeof include === 'undefined') {
    return {};
  }

  let result = filterVueFiles(include);

  if (Array.isArray(prettyList)
    && prettyList.every(Array.isArray)) {
    result = prettifyFiles(prettyList);
  }

  return result;
};

/**
 * 查找目录下冗余文件
 */
export const findeRedudantFiles = (param: FridayConfig) => {
  findAllFilesDependency(param);
  const {
    output,
    regExp,
  } = param;
  assert(isObj(output), '需要传入 output - 输出对象');
  const { fileName = '' } = output;
  assert(!!fileName && isStr(fileName), '需要传入 output: { fileName } - 输出冗余文件信息的json');
  const { exclude = [] } = regExp || {};
  assert(exclude.every(isRe), 'exclude 只能是正则数组');
  return searchRedundantComp(fileName, { exclude });
};

/**
 * 统计页面、组件数量
 *
 * 需要设置router根文件路径（考虑pretty的情况）
 *
 * @param param
 */
export const statisticPageAndCompCount = (param: FridayConfig) => {
  findAllFilesDependency(param);
  const {
    entry: { router },
  } = param;

  if (typeof router === 'undefined') {
    return assert(isStr(router), '需要传入 entry: { router } - router文件路径');
  }

  return statisticData(router);
};

/**
 * 画项目全景图
 */
export const drawDependencyOverview = async (param: FridayConfig) => {
  findAllFilesDependency(param);
  const {
    output,
  } = param;
  assert(isObj(output), '需要传入 output - 输出对象');
  const {
    fileName,
    compress,
  } = output;

  if (typeof fileName === 'undefined') {
    return assert(isStr(fileName), '需要传入 output: { fileName } - 输出原始图片路径');
  }

  assert(isStr(compress), '建议传入 output: { compress } - 输出压缩后的图片路径', false);
  await drawDependencyImage(fileName, {
    compressPath: compress,
  });
};

/**
 * 画项目各页面模块图
 */
export const drawDependencySplit = async (param: FridayConfig) => {
  const result = findAllFilesDependency(param);
  const {
    entry: { router },
    output,
  } = param;
  assert(isObj(output), '需要传入 output - 输出对象');
  const {
    dir = '',
  } = output;

  if (!dir) {
    return Promise.resolve(result);
  }

  await drawSplitDependencyImage(dir, router);
};

/**
 * 查找目录下所有less，生成树
 * @param param
 */
export const findAllLess = async (param: FridayConfig) => {
  const {
    entry,
    regExp,
  } = param;
  assert(isObj(entry), '需要传入 entry - 输入对象');
  const { src } = entry;
  assert(isStr(src), '需要传入 entry: { src } - 查找目录');
  let { vue, less } = regExp || {};
  vue = vue || vueRe;
  assert(isRe(vue), 'regExp: { vue } - 查找.vue文件正则');
  less = less || lessRe;
  assert(isRe(less), 'regExp: { less } - 查找.less文件正则');
  const result = await analyseLessUsage(src, {
    vue: [vue],
    css: [less],
  });
  return result;
};

/**
 * 画样式树
 * @param param
 */
export const drawStyleOverview = async (param: FridayConfig) => {
  await findAllLess(param);
  const {
    entry: { src },
    output,
  } = param;
  assert(isObj(output), '需要传入 output - 输出对象');
  const {
    fileName,
    compress,
  } = output;
  assert(isStr(fileName), '需要传入 output: { fileName } - 输出原始图片路径');
  assert(isStr(compress), '建议传入 output: { compress } - 输出压缩后的图片路径', false);
  await genLessUsageTree(src, {
    stylePath: fileName,
    styleCompressPath: compress,
  });
};

/**
 * 画属性树
 * @param param
 */
export const drawAttrOverview = async (param: FridayConfig) => {
  await findAllLess(param);
  const {
    entry: { src },
    output,
  } = param;
  assert(isObj(output), '需要传入 output - 输出对象');
  const {
    fileName,
    compress,
  } = output;
  assert(isStr(fileName), '需要传入 output: { fileName } - 输出原始图片路径');
  assert(isStr(compress), '建议传入 output: { compress } - 输出压缩后的图片路径', false);
  await genLessUsageTree(src, {
    attrPath: fileName,
    attrCompressPath: compress,
  });
};

/**
 * vuepress文件生成
 * @param param
 */
export const createVuepressPage = async (param: FridayConfig) => {
  const {
    clearList = [],
    prettyList = [],
    entry,
    output,
    plugin = [],
    regExp,
  } = param;

  if (Array.isArray(plugin)) {
    registerPlugins(plugin);
  }

  assert(isObj(entry), '需要传入 output - 输出对象');
  assert(isObj(output), '需要传入 output - 输出对象');
  // 初始化（清空路径）
  clearEntryPath(clearList || []);
  const {
    src,
    node,
    configFile,
  } = entry;
  assert(isStr(src), '需要传入 entry: { src } - 项目源文件');
  assert(isStr(node), '需要传入 entry: { node } - node_modules目录');
  const {
    dir,
    subDir,
  } = output;
  assert(isStr(subDir), '需要传入 output: { subDir } - .vuepress/components目录');
  assert(isStr(dir), '需要传入 output: { dir } - *.md文件输出目录');
  // 复制源文件至 vuepress 目录
  copyOriginToVuepress(src, subDir);
  // 更新预配置文件
  updateLocalConfig(configFile);
  // 更新js/less/vue文件内容并生成依赖树
  updateDependencies({
    root: src,
    vuepress: subDir,
    node,
  }, regExp || {});
  // 提取组件的引用关系
  updateComponentUsageFromImport(entry, subDir, vueRe);
  // 组件循环插入 vupress 页面
  iterateInsertCompToVuepress(entry, output);
  // 生成结束处理（清理临时文件等）
  finishGenerate(configFile);
};

/**
 * 将目录下.vue文件拆分后，和其他文件，一同复制到另一个目录
 * @param param
 */
export const copyFilesAndSplitVue = (param: FridayConfig) => {
  const {
    entry,
    output,
  } = param;
  assert(isObj(entry), '需要传入 output - 输出对象');
  assert(isObj(output), '需要传入 output - 输出对象');
  const { src = '' } = entry;
  const { dir = '' } = output;
  assert(isStr(src), '需要传入 entry: { src } - 输入目录');
  assert(isStr(dir), '需要传入 output: { src } - 输出目录');
  cleardir(dir);
  // 复制源文件至特定目录
  copyOriginToVuepress(src, dir);
  // 将vue文件拆分为html、css、js
  splitVueToCommonFiles(dir);
};

/**
 * 提取&替换less属性值
 * @param param
 */
export const extractLessVariable = async (param: FridayConfig) => {
  const {
    entry,
    regExp,
    skip = [],
  } = param;
  assert(isObj(entry), '需要传入 entry - 输入对象');
  const {
    src,
    replacements,
  } = entry;
  assert(isStr(src), '需要传入 entry: { src } - 查找目录');
  let { vue, less } = regExp || {};
  vue = vue || vueRe;
  assert(isRe(vue), 'regExp: { vue } - 查找.vue文件正则');
  less = less || lessRe;
  assert(isRe(less), 'regExp: { less } - 查找.less文件正则');
  assert(Array.isArray(replacements), '需要传入 entry: { replacements } - less替换内容');
  assert(Array.isArray(skip), 'skip - 跳过的文件，类型必须是RegExp[]');
  const result = await replaceCommonLess(src, {
    vue: [vue],
    css: [less],
    skip,
    replacements,
  });
  return result;
};
