const { join } = require('path');
const {
  DEFAULT_CONFIG_FILE,
  ROOT,
  SKELETON_DEFAULT_WXSS_FILE,
  SKELETON_RELATIVE,
  SKELETON_ROOT,
  SRC,
} = require('./config');
const { init: initLogger } = require('./utils/log');
const { assertOptions } = require('./utils/assert');
const { genNewComponent, genResourceFile, getPageWxml } = require('./utils');

const run = (options: any = {}): void => {
  options = assertOptions(options  || {});
  const { inputDir, outputDir, root, ignore, page, treeshake } = options;
  const srcPath = inputDir ? join(root, inputDir) : `${root}/src`;
  const outputPath = outputDir ? join(root, outputDir) : `${root}/src${SKELETON_RELATIVE}`;
  const pageWxml = getPageWxml(`${srcPath}/pages/*/*.wxml`, page);
  const pagePath = `${outputPath}/pages`;
  const compPath = `${outputPath}/components`;
  initLogger(pageWxml);
  pageWxml.forEach((wxml: string): void => {
    const pageOptions: any = {
      root,
      srcPath,
      outputPath,
      pagePath,
      compPath,
      wxmlKlassInfo: {},
      wxmlStructInfo: {},
      usingComponentKeys: new Set(),
      skeletonKeys: new Set(),
      verbose: false,
      ignoreTags: ignore,
      treeshake,
    };
    genNewComponent(wxml, pageOptions);
  });
  genResourceFile(`${outputPath}${SKELETON_DEFAULT_WXSS_FILE}`);
};

run.defaultConfigName = DEFAULT_CONFIG_FILE;

module.exports = run;
