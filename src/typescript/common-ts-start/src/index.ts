import {
  startGenerate,
  copyOriginToVuepress,
  updateDependencies,
  updateComponentUsageFromImport,
  iterateInsertCompToVupress,
  finishGenerate,
} from './compiler';

const rootPath = 'PROJECT_PATH';
const from = `${rootPath}src`;
const nodeModulePath = `${rootPath}node_modules/`;
const to = `${rootPath}docs/.vuepress/components`;
const readMeFile = `${rootPath}docs/help/README.md`;
const vueRe = /.+\.vue$/;
const jsRe = /\.(t|j)sx?$/;
const cssRe = /\.(c|le|sc|sa)ss$/;

const generate = () => {
  // 初始化（清空路径）
  startGenerate(to);
  // 复制源文件至 vuepress 目录
  copyOriginToVuepress(from, to);
  // 更新js/less/vue文件内容并生成依赖树
  updateDependencies({
    root: to,
    npm: nodeModulePath,
  }, {
    vue: [vueRe],
    js: [jsRe],
    css: [cssRe],
  });
  // 找到各个组件的父引用
  updateComponentUsageFromImport(to, vueRe);
  // 组件循环插入 vupress 页面
  iterateInsertCompToVupress(to, readMeFile);
  // 生成结束处理（清理临时文件等）
  finishGenerate();
};

generate();
