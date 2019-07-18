const { join } = require('path');
const {
  DEFAULT_CONFIG_FILE,
  DEFAULT_JS,
  DEFAULT_WXSS,
  ROOT,
  SKELETON_DEFAULT_WXSS_FILE,
  SKELETON_DEFAULT_JS_FILE,
  SKELETON_RELATIVE,
  SKELETON_ROOT,
  SRC,
  updateDefaultWxss,
} = require('./config');
const { init: initLogger } = require('./utils/log');
const { assertOptions } = require('./utils/assert');
const {
  genNewComponent,
  genResourceFile,
  getPageWxml,
  transMap2Style,
} = require('./utils');

const run = (options: any = {}): void => {
  options = assertOptions(options  || {});
  const {
    inputDir,
    outputDir,
    root,
    ignore,
    page,
    treeshake,
    animation,
    watch,
  } = options;
  const srcPath = inputDir ? join(root, inputDir) : `${root}/src`;
  const outputPath = outputDir ? join(root, outputDir) : `${root}/src${SKELETON_RELATIVE}`;
  const pageWxml = getPageWxml(`${srcPath}/pages/*/*.wxml`, page);
  const pagePath = `${outputPath}/pages`;
  const compPath = `${outputPath}/components`;
  const globalWxssMap = new Map();
  initLogger(pageWxml);
  pageWxml.forEach((wxml: string): void => {
    const pageOptions: any = {
      root,
      srcPath,
      outputPath,
      pagePath,
      compPath,
      watch,
      wxmlKlassInfo: {},
      wxmlStructInfo: {},
      wxssInfo: globalWxssMap,
      usingComponentKeys: new Set(),
      skeletonKeys: new Set(),
      verbose: false,
      ignoreTags: ignore,
      treeshake,
    };
    genNewComponent(wxml, pageOptions);
  });
  // global wxss
  if (animation) {
    updateDefaultWxss(animation);
  }
  genResourceFile(
    `${outputPath}${SKELETON_DEFAULT_WXSS_FILE}`,
    transMap2Style(DEFAULT_WXSS, globalWxssMap),
  );

  // global js
  genResourceFile(`${outputPath}${SKELETON_DEFAULT_JS_FILE}`, DEFAULT_JS);
};

run.defaultConfigName = DEFAULT_CONFIG_FILE;

module.exports = run;
