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
const { init: updateLogger } = require('./utils/log');
const { assertOptions } = require('./utils/assert');
const {
  genNewComponent,
  genResourceFile,
  getPageWxml,
  removeUnused,
  transMap2Style,
} = require('./utils');

const run = (options: any = {}): void => {
  options = assertOptions(options  || {});
  const {
    inputDir,
    outDir,
    root,
    ignore,
    page,
    treeshake,
    animation,
    deleteUnused,
    watch,
    defaultBg,
    subPackage,
  } = options;
  const srcPath = inputDir ? join(root, inputDir) : `${root}/src`;
  const outputPath = outDir ? `${join(root, outDir)}${SKELETON_RELATIVE}` : `${srcPath}${SKELETON_RELATIVE}`;
  const pageWxml = getPageWxml(`${srcPath}/pages/*/*.wxml`, page);
  const pageCollection = [...pageWxml];
  const pagePath = `${outputPath}/pages`;
  const compPath = `${outputPath}/components`;
  const globalWxssMap = new Map();
  const globalTemplateMap: Map<string, string> = new Map();
  const globalComponentSet: Set<string> = new Set();

  const getPageOptions = (
    s: string = srcPath,
    o: string = outputPath,
    p: string = pagePath,
    c: string = compPath,
    subPageRoot?: string,
  ): any => ({
    root,
    srcPath: s,
    outputPath: o,
    pagePath: p,
    compPath: c,
    deleteUnused,
    watch,
    defaultBg,
    wxmlKlassInfo: {},
    wxmlStructInfo: {},
    wxssInfo: globalWxssMap,
    wxTemplateInfo: globalTemplateMap,
    wxComponentInfo: globalComponentSet,
    usingTemplateKeys: new Map(),
    usingComponentKeys: new Map(),
    skeletonKeys: new Set(),
    verbose: true,
    ignoreTags: ignore,
    treeshake,
    subPageRoot,
  });

  // update main page logger
  updateLogger(pageCollection);

  // gen main page files
  pageWxml.forEach((wxml: string): void => {
    const pageOptions: any = getPageOptions();
    genNewComponent(wxml, pageOptions);
  });

  // gen sub page files
  if (Array.isArray(subPackage)) {
    subPackage.forEach((sub: any) => {
      const { root: subRoot, page: subPage } = sub;
      const subSrc = join(srcPath, subRoot);
      const subOut = outDir
        ? `${join(root, outDir, subRoot)}${SKELETON_RELATIVE}`
        : `${join(subSrc, subRoot)}${SKELETON_RELATIVE}`;
      const subPagePath = `${subOut}/pages`;
      const subCompPath = `${subOut}/components`;
      const subPageWxml = getPageWxml(`${subSrc}/*/*.wxml`, subPage);
      // update sub page logger
      updateLogger(pageCollection);
      subPageWxml.forEach((wxml: string): void => {
        const pageOptions: any = getPageOptions(subSrc, subOut, subPagePath, subCompPath, srcPath);
        genNewComponent(wxml, pageOptions);
      });
      pageCollection.push(...subPageWxml);
    });
  }

  // insert animation
  if (animation) {
    updateDefaultWxss(animation);
  }

  // global wxss
  genResourceFile(
    `${outputPath}${SKELETON_DEFAULT_WXSS_FILE}`,
    transMap2Style(DEFAULT_WXSS, globalWxssMap),
  );

  // global js
  genResourceFile(`${outputPath}${SKELETON_DEFAULT_JS_FILE}`, DEFAULT_JS);

  // remove unused template/component
  if (!watch && deleteUnused) {
    removeUnused({
      template: globalTemplateMap,
      component: globalComponentSet,
    });
  }
};

run.defaultConfigName = DEFAULT_CONFIG_FILE;

module.exports = run;
