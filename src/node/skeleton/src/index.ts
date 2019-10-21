const { join } = require('path');
const {
  DEFAULT_CONFIG_FILE,
  DEFAULT_JS,
  DEFAULT_WXSS,
  SKELETON_DEFAULT_WXSS_FILE,
  SKELETON_DEFAULT_SCSS_FILE,
  SKELETON_DEFAULT_JS_FILE,
  SKELETON_RELATIVE,
  WXSS_BG_GREY,
  updateBgWxss,
  updateDefaultWxss,
} = require('./config');
const { init: updateLogger } = require('./utils/log');
const { assertOptions } = require('./utils/assert');
const { getRelativePath } = require('./utils/dir');
const {
  genNewComponent,
  genNewReactComponent,
  genResourceFile,
  getPageWxml,
  removeUnused,
  transMap2Style,
  filterUsableSelectors,
  treewalk,
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
    tplWxss,
    subPackage,
    defaultGrey,
    react,
  } = options;
  const srcPath = inputDir ? join(root, inputDir) : `${root}/src`;
  const outputPath = outDir ? `${join(root, outDir)}${SKELETON_RELATIVE}` : `${srcPath}${SKELETON_RELATIVE}`;
  const pageWxml = getPageWxml(`${srcPath}/pages/*/*.wxml`, page);
  const pageCollection = [...pageWxml];
  const pagePath = `${outputPath}/pages`;
  const compPath = `${outputPath}/components`;
  const globalWxssPath = `${outputPath}${SKELETON_DEFAULT_WXSS_FILE}`;
  const globalScssPath = `${outputPath}${SKELETON_DEFAULT_SCSS_FILE}`;
  const globalWxssMap = new Map();
  const globalTemplateMap: Map<string, string> = new Map();
  const globalComponentSet: Set<string> = new Set();
  const globalReactComponentSet: Set<string> = new Set();

  const getPageOptions = (): any => ({
    globalOutputPath: outputPath,
    root,
    srcPath,
    outputPath,
    pagePath,
    compPath,
    deleteUnused,
    watch,
    tplWxss,
    defaultBg,
    wxmlKlassInfo: {},
    wxmlStructInfo: {},
    wxssInfo: globalWxssMap,
    wxTemplateInfo: globalTemplateMap,
    wxComponentInfo: globalComponentSet,
    reactComponentInfo: globalReactComponentSet,
    resolvedReactCompKey: new Set(),
    usingTemplateKeys: new Map(),
    usingComponentKeys: new Map(),
    skeletonKeys: new Set(),
    verbose: true,
    ignoreTags: ignore,
    treeshake,
    globalWxssPath,
    globalScssPath,
  });

  const buildReact = (): void => {
    if (react) {
      const {
        root: reactRoot = '',
        pageRoot: reactPageRoot = 'pages',
        suffix = 'tsx',
        targetSuffix = 'jsx',
        page: reactPage = [],
      } = react;
      const pageOptions: any = getPageOptions();
      const subSrc = join(srcPath, reactRoot);
      const subOut = outDir
        ? `${join(root, outDir, reactRoot)}${SKELETON_RELATIVE}`
        : `${join(subSrc, reactRoot)}${SKELETON_RELATIVE}`;
      const subPagePath = `${subOut}/${reactPageRoot}`;
      const reactPageFile = getPageWxml(
        `${subSrc}/${reactPageRoot}/**/*.${suffix}`,
        reactPage,
        suffix,
      );

      reactPageFile.forEach((p: string): void => {
        // update subpage logger
        updateLogger(pageCollection);
        let relativePage;
        reactPage.some((rp: string) => {
          if (p.indexOf(`${rp}.`) > -1) {
            relativePage = rp;
            return true;
          }
          return false;
        });
        pageOptions.srcPath = subSrc;
        pageOptions.outputPath = subOut;
        pageOptions.outputPagePath = `${subPagePath}/${relativePage}.${targetSuffix}`;
        genNewReactComponent(p, pageOptions);
      });
      pageCollection.push(...reactPageFile);
    }
  };

  const buildSubpage = (): void => {
    if (Array.isArray(subPackage)) {
      subPackage.forEach((sub: any) => {
        const { root: subRoot, page: subPage, independent } = sub;
        const subSrc = join(srcPath, subRoot);
        const subOut = outDir
          ? `${join(root, outDir, subRoot)}${SKELETON_RELATIVE}`
          : `${join(subSrc, subRoot)}${SKELETON_RELATIVE}`;
        const subPagePath = `${subOut}/pages`;
        const subCompPath = `${subOut}/components`;
        const subPageWxml = getPageWxml(`${subSrc}/!(skeleton)/**/*.wxml`, subPage);
        // update sub page logger
        updateLogger(pageCollection);
        subPageWxml.forEach((wxml: string): void => {
          const pageOptions: any = getPageOptions();
          pageOptions.srcPath = subSrc;
          pageOptions.outputPath = subOut;
          pageOptions.pagePath = subPagePath;
          pageOptions.compPath = subCompPath;
          pageOptions.subPageRoot = srcPath;
          pageOptions.independent = independent;
          genNewComponent(wxml, pageOptions);
        });
        pageCollection.push(...subPageWxml);

        if (independent) {
          // TODO independent subPackage should not depend on commone wxss/js in mainPackage
        }
      });
    }
  };

  const buildPage = (): void => {
    if (pageWxml.length) {
      pageWxml.forEach((wxml: string): void => {
        const pageOptions: any = getPageOptions();
        genNewComponent(wxml, pageOptions);
      });
    }
  };

  const updateOptionStyle = (): void => {
    // insert animation
    if (animation) {
      updateDefaultWxss(animation);
    }

    // insert default grey background
    if (defaultGrey) {
      updateBgWxss(WXSS_BG_GREY, defaultGrey);
    }
  };

  const buildGlobalResource = (): void => {
    // global wxss
    const mapStyle = transMap2Style(DEFAULT_WXSS, globalWxssMap);

    // if `page` option exist
    if (page || subPackage) {
      genResourceFile(globalWxssPath, mapStyle);

      // global js
      genResourceFile(
        `${outputPath}${SKELETON_DEFAULT_JS_FILE}`,
        DEFAULT_JS,
      );
    }

    // if has react page, generate a new global scss
    if (react) {
      genResourceFile(globalScssPath, mapStyle);
    }
  };

  const buildDone = (): void => {
    // remove unused template/component
    if (!watch && deleteUnused) {
      removeUnused({
        template: globalTemplateMap,
        component: globalComponentSet,
      });
    }
  };

  // main
  updateLogger(pageCollection);
  buildPage();
  buildSubpage();
  buildReact();
  updateOptionStyle();
  buildGlobalResource();
  buildDone();
};

run.defaultConfigName = DEFAULT_CONFIG_FILE;

run.test = {
  filterUsableSelectors,
  treewalk,
  getRelativePath,
};

module.exports = run;
