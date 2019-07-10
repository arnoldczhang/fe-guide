const { join } = require('path');
const {
  DEFAULT_CONFIG_FILE,
  ROOT,
  SKELETON_DEFAULT_WXSS_FILE,
  SKELETON_RELATIVE,
  SKELETON_ROOT,
  SRC,
} = require('./config');
const { assertOptions } = require('./utils/assert');
const { genNewComponent, genResourceFile, getPageWxml } = require('./utils');

const run = (options: any = {}) => {
  options = options  || {};
  assertOptions(options);
  const { inputDir, outputDir, root, ignore, page } = options;
  const srcPath = inputDir ? join(root, inputDir) : `${root}/src`;
  const outputPath = outputDir ? join(root, outputDir) : `${root}/src${SKELETON_RELATIVE}`;
  const pageWxml = getPageWxml(`${srcPath}/pages/*/*.wxml`, page);
  const pagePath = `${outputPath}/pages`;
  const compPath = `${outputPath}/components`;
  pageWxml.forEach((wxml: string): void => {
    genNewComponent(wxml, {
      root,
      srcPath,
      outputPath,
      pagePath,
      compPath,
      wxmlKlassInfo: {},
      verbose: false,
      ignoreTags: ignore,
    });
  });
  genResourceFile(`${outputPath}${SKELETON_DEFAULT_WXSS_FILE}`);
};

run.defaultConfigName = DEFAULT_CONFIG_FILE;

module.exports = run;
