import {
  searchAllFiles,
  filterVueFiles,
  prettifyFiles,
  statisticData,
  drawSplitDependencyImage,
  drawDependencyImage,
  searchRedundantComp,
} from './tree';

const rootPath = 'ROOT/PROJECT_PATH/';
const from = `${rootPath}src`;
const nodeModulePath = `${rootPath}node_modules/`;
const redundantPath = 'ROOT/compFinder/redundant.json';
const imagePath = 'ROOT/compFinder/tree';
const imageOutPath = 'ROOT/compFinder/tree.svg';
const imageMiniPath = 'ROOT/compFinder/tree-mini.svg';
const vueRe = /.+\.vue$/;
const jsRe = /\.(t|j)sx?$/;

const drawTree = () => {
  // 找到文件夹下所有目标文件生成简易依赖树
  searchAllFiles(from, nodeModulePath, {
    vue: [vueRe],
    js: [jsRe],
  });
  // 读取vue文件
  filterVueFiles(/(?:.+\.vue|\/router\/index\.(t|j)s|main\.tsx?)$/);
  // 美化路径
  prettifyFiles([
    [from, '@'],
    [nodeModulePath, ''],
  ]);
  // 找到冗余组件
  searchRedundantComp(redundantPath, {
    skip: [
      /(?:\/router\/index\.(t|j)s|main\.tsx?)$/,
      /App\.vue$/,
    ],
  });
  // 统计数据
  statisticData();
  // 按页面模块画依赖图
  drawSplitDependencyImage(imagePath);
  // 画整体依赖图
  drawDependencyImage(imageOutPath, imageMiniPath);
};

drawTree();
