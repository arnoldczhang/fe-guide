import {
  startGenerate,
  copyOriginToVuepress,
  updateDependencies,
  updateMockData,
  iterateInsertCompToVupress,
  finishGenerate,
} from './compiler';
import {
  searchAllFiles,
  filterVueFiles,
  prettifyFiles,
  drawDependencyImage,
} from './tree';

const from = 'ROOT/src';
const nodeModulePath = 'ROOT/node_modules/';
const to = 'ROOT/docs/.vuepress/components';
const imagePath = 'IMG_ROOT/tree.png';
const imageMiniPath = 'IMG_ROOT/tree-mini.jpg';
const vueRe = /.+\.vue$/;
const jsRe = /\.(t|j)sx?$/;
const cssRe = /\.(c|le|sc|sa)ss$/;

const generate = () => {
  // 初始化（清空路径）
  startGenerate(to);
  // 复制源文件至 vuepress 目录
  copyOriginToVuepress(from, to);
  // 更新 vuepress 下各文件的依赖（文件路径、less 全局文件等）
  updateDependencies(to, {
    vue: [vueRe],
    js: [jsRe],
    css: [cssRe],
  });
  // 读取各组件的 mock 数据（若有）
  updateMockData();
  // 组件循环插入 vupress 页面
  iterateInsertCompToVupress();
  // 生成结束处理（清理临时文件等）
  finishGenerate();
};

// generate();

const drawTree = () => {
  // 找到文件夹下所有目标文件生成简易依赖树
  searchAllFiles(from, nodeModulePath, {
    vue: [vueRe],
    js: [jsRe],
  });
  // 读取vue文件
  filterVueFiles(/(?:.+\.vue$|\/router\/index\.js$)/);
  // 美化路径
  prettifyFiles([
    [from, '@'],
    [nodeModulePath, ''],
  ]);
  // 画依赖图
  drawDependencyImage(imagePath, imageMiniPath);
};

drawTree();
