const { join } = require('path');
const {
  DEFAULT_CONFIG_FILE,
  ROOT,
  SKELETON_DEFAULT_WXSS_FILE,
  SKELETON_RELATIVE,
  SKELETON_ROOT,
  SRC,
} = require('./config');
const { genNewComponent, genResourceFile, getPageWxml } = require('./utils');

const run = (options: any = {}) => {
  options = options  || {};
  const { inputDir, outputDir, root } = options;
  const srcPath = inputDir ? join(root, inputDir) : `${root}/src`;
  const outputPath = outputDir ? join(root, outputDir) : `${root}/src${SKELETON_RELATIVE}`;
  const pageWxml = getPageWxml(`${srcPath}/pages/*/*.wxml`);
  const pagePath = `${outputPath}/pages`;
  const compPath = `${outputPath}/components`;

  pageWxml.forEach((wxml: string): void => {
    genNewComponent(wxml, {
      root,
      srcPath,
      outputPath,
      pagePath,
      compPath,
    });
  });
  genResourceFile(`${outputPath}${SKELETON_DEFAULT_WXSS_FILE}`);
};

run.defaultConfigName = DEFAULT_CONFIG_FILE;

module.exports = run;
