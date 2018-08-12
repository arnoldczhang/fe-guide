/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const color = require('chalk');
const resolve = require('resolve');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const async = require('async');
const signale = require('signale');

console.note = signale.note;

const {
  readFileSync: readS,
  copySync:copyS,
  writeFile: write,
  statSync: statS,
  removeSync: removeS,
} = fs;

const {
  CONST,
  Cach,
  Spinner,
  Logger,
  isProd,
  isDev,
  logStart,
  logEnd,
  uglify,
  minImage,
  searchFiles,
  compressFile,
  ensureRunFunc,
  clearConsole,
  babelTransform,
  babelTraverse,
  babelGenerator,
  catchError,
  getWebpackCssConfig,
  replaceSlash,
  keys,
  getSuffix,
  fixWavy,
  getPathBack,
} = require('./utils');

const buildRelativeDir = '../';

let {
  SRC,
  DIR,
  DEST,
} = CONST;

let initial = false;
let time;
let logger;

const jsRe = /\.js$/;
const npmPrefixRe = /^[~_@a-zA-Z]/;
const fileNameRe = /\/([^\/]+)$/;

Cach.init('node_modules');
let absoluteSrcPath = path.join(__dirname, buildRelativeDir, `${SRC}`);
let absoluteDestPath = path.join(__dirname, buildRelativeDir, `${DEST}`);
let absoluteDestNpmPath = path.join(__dirname, buildRelativeDir, `${DEST}/npm`);
const getRelativeFilePath = (src, prefix) => replaceSlash(src.replace(`${prefix}/`, ''));

const traversePathCode = (
  nodeModulePath = '',
  npmPath = '',
  dest = absoluteDestNpmPath,
) => (wxTraverse(babelTransform(readS(npmPath)).ast, npmPath, dest, {
  nodeModulePath,
  module: true,
  debug: true,
}));

const copyCachModule = (
  name,
  {
    module = false,
    isModuleCall = false,
    fixSuffix = false,
    nodeModulePath = '',
  } = {},
) => {
  let nodeModuleFoldPath;
  nodeModulePath = isModuleCall
    ? resolve.sync(name, path.join(__dirname, buildRelativeDir))
    : path.resolve(nodeModulePath, '../', name);

  const destNpmPath = `${DEST}/npm`;
  nodeModulePath = replaceSlash(nodeModulePath);
  let npmPath = nodeModulePath.replace(/([\/]node_modules)/, destNpmPath);

  if (fixSuffix) {
    nodeModulePath = nodeModulePath.replace(jsRe, '');
    nodeModuleFoldPath = nodeModulePath.replace(fileNameRe, '');
    npmPath = npmPath.replace(fileNameRe, '');
  }

  if ((isModuleCall || module) && !Cach.get('node_modules', nodeModulePath)) {
    if (!jsRe.test(nodeModulePath)) {
      try {
        Cach.set('node_modules', nodeModulePath, 1);
        const stat = statS(nodeModuleFoldPath);
        if (stat.isDirectory()) {
          const files = searchFiles(/\.(?:js|wxml|json|wxss)$/, nodeModuleFoldPath);
          keys(files, (key) => {
            const src = files[key];
            const dest = path.join(npmPath, key);
            copyS(src, dest);
            if (jsRe.test(src)) {
              traversePathCode(src, dest);
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      Cach.set('node_modules', nodeModulePath, 1);
      copyS(nodeModulePath, npmPath);
      traversePathCode(nodeModulePath, npmPath);
    }
  }
  return nodeModulePath.replace(fixSuffix ? /^[\s\S]+node_modules\// : '', '');
};

const resolveNpmPath = (
  args = [],
  reqSrc = '',
  prefixPath = '',
  {
    module = false,
    debug = false,
    nodeModulePath = '',
  } = {},
) => {
  if (!args.length) return;
  reqSrc = replaceSlash(reqSrc);
  prefixPath = replaceSlash(prefixPath);
  const firstArgsValue = args[0].value;
  let moduleName = fixWavy(replaceSlash(firstArgsValue));
  const isModuleCall = npmPrefixRe.test(moduleName);
  const cachProps = {
    module,
    isModuleCall,
    nodeModulePath,
  };

  if (isModuleCall) {
    const relativeSrcPath = getRelativeFilePath(reqSrc, prefixPath);
    const prefix = getPathBack(relativeSrcPath);
    nodeModulePath = copyCachModule(moduleName, cachProps);
    const sliceIndex = nodeModulePath.indexOf(moduleName) + moduleName.length;
    const relativeFilePath = nodeModulePath.slice(sliceIndex);
    return `${prefix || './'}${module ? '' : 'npm/'}${moduleName}${relativeFilePath}`;
  } else if (!jsRe.test(moduleName)) {
    let indexPath;
    try {
      const npmStat = statS(path.resolve(reqSrc, buildRelativeDir, moduleName));
      if (npmStat.isDirectory()) {
        indexPath = `${moduleName}/index.js`;
      }
    } catch (err) {
      indexPath = `${moduleName}.js`;
    } finally {
      if (nodeModulePath) {
        nodeModulePath = copyCachModule(indexPath || firstArgsValue, cachProps);
      }
      return indexPath;
    }
  } else if (module) {
    nodeModulePath = copyCachModule(firstArgsValue, cachProps);
  }
  return firstArgsValue;
};

const wxTraverse = (
  ast,
  src,
  prefixPath = absoluteSrcPath,
  options = {},
) => {
  const { nodeModulePath, module } = options;
  babelTraverse(ast, {
    CallExpression({ node }) {
      if (node) {
        const { callee = {} } = node;
        const nodeArgs = node.arguments || [];
        const { loc = {} } = callee;
        const { identifierName = '' } = loc;
        if (identifierName === 'require') {
          nodeArgs[0].value = resolveNpmPath(nodeArgs, src, prefixPath, options)
            || nodeArgs[0].value;
        }
      }
    },

    VariableDeclarator({ node }) {
      if (node) {
        let { init = {} } = node;
        init = init || {};
        const { callee = {} } = init;
        const initArgs = init.arguments || [];
        if (callee.name === 'require') {
          initArgs[0].value = resolveNpmPath(initArgs, src, prefixPath, options)
            || initArgs[0].value;
        }
      }
    },
  });
  const { code } = babelGenerator(ast);
  if (module) {
    write(src, isProd() ? uglify(code) : code);
  }
  return code;
};

const compileCompressFile = (
  filePath,
  destPath,
  {
    hooks = {},
    compress = true,
    dest = DEST,
    encoding = 'utf8',
    input = '',
    src = '',
  } = {},
) => {
  const destFile = path.join(__dirname, buildRelativeDir, `./${dest}${destPath}`);
  if (typeof filePath === 'string') {
    try {
      ensureRunFunc(hooks.start);
      ensureRunFunc(hooks.willCompress, filePath, destPath);
      const file = compressFile(input || readS(filePath), compress);
      const hookArgs = [file, filePath, destFile, src];
      ensureRunFunc(hooks.didCompress, ...hookArgs);
      ensureRunFunc(hooks.willCopy, ...hookArgs);
      copyS(filePath, destFile);
      ensureRunFunc(hooks.didCopy, ...hookArgs);
      const lastResult = ensureRunFunc(hooks.willRewrite, ...hookArgs);
      write(destFile, lastResult || file, { encoding });
      ensureRunFunc(hooks.didRewrite, ...hookArgs);
      ensureRunFunc(hooks.end);
    } catch (err) {
      console.log(color.red(err));
    }
  }
};

const compileCompressFiles = (
  re,
  hooks = {},
  extraHookName = {},
) => (
  src = absoluteSrcPath,
  dest = absoluteDestPath,
  callback,
  {
    compress = true,
    hooks: extraHooks = {},
  } = {},
) => {
  const entry = searchFiles(re, src);
  const end = hooks.end;
  const hookArgs = [entry, src];
  ensureRunFunc(extraHooks[extraHookName.start], ...hookArgs);
  ensureRunFunc(hooks.start, ...hookArgs);
  delete hooks.start;
  delete hooks.end;
  keys(entry, key => compileCompressFile(entry[key], key, { compress, hooks, src }));
  ensureRunFunc(end, ...hookArgs);
  ensureRunFunc(extraHooks[extraHookName.end], ...hookArgs);
  ensureRunFunc(callback);
};

const jsonWillRewriteHook = (file, ...args) => {
  try {
    const json = JSON.parse(file);
    const { usingComponents } = json;
    const [ filePath, destFile, src ] = args;
    if (usingComponents) {
      keys(usingComponents, (compKey) => {
        let compPath = usingComponents[compKey];
        if (npmPrefixRe.test(compPath)) {
          compPath = fixWavy(compPath);
          const relativeSrcPath = getRelativeFilePath(filePath, src);
          const prefix = getPathBack(relativeSrcPath);
          compPath = copyCachModule(compPath, {
            isModuleCall: true,
            fixSuffix: true,
          });
          usingComponents[compKey] = `${prefix || './'}npm/${compPath}`;
        }
      });
      return JSON.stringify(json);
    }
  } catch (err) {
    console.log(color.red(`json file format error`));
  }
};

const compileJsonFiles = compileCompressFiles(/\.(?:json)$/, {
  start(json) {
    logger.await('compile json');
    Cach.init('json', json);
  },
  didCopy(file, filePath) {
    if (/app\.json$/.test(filePath)) {
      Cach.set('wxml', filePath, file);
    }
  },
  willRewrite: jsonWillRewriteHook,
  end() {
    logger.success('compile json');
  },
}, {
  start: 'beforeJsonCompile',
  end: 'afterJsonCompile',
});

const compileWxmlFiles = compileCompressFiles(/\.(?:wxml)$/, {
  start() {
    logger.await('compile wxml');
    Cach.init('wxml', {});
  },
  didRewrite(file, filePath) {
    Cach.set('wxml', filePath, file);
  },
  end() {
    logger.success('compile wxml');
  },
}, {
  start: 'beforeWxmlCompile',
  end: 'afterWxmlCompile',
});

const webpackWxssFiles = (
  entry = {},
  callback,
  options = {},
) => {
  if (typeof callback === 'object') {
    options = callback;
    callback = null;
  }

  const {
    webpackFlag = true,
    hooks = {},
  } = options;
  const cssConfig = getWebpackCssConfig(entry, options);

  ensureRunFunc(hooks.beforeWxssCompile);
  if (ensureRunFunc(hooks.start) === false) {
    logger.await('compile wxss');
  }

  if (webpackFlag) {
    webpack(cssConfig, catchError(() => {
      if (ensureRunFunc(hooks.end) === false) {
        logger.success('compile wxss');
        ensureRunFunc(hooks.afterWxssCompile);
        ensureRunFunc(callback);
      }
    }));
  } else {
    logger.success('compile wxss');
    ensureRunFunc(hooks.afterWxssCompile);
    ensureRunFunc(callback);
  }

  return cssConfig;
};

const compileWxssFiles = (
  src = absoluteSrcPath,
  dest = absoluteDestPath,
  callback,
  options = {},
) => {
  const entry = searchFiles(/\.(?:wxss)$/, src);
  Cach.init('wxss', entry);
  return webpackWxssFiles(entry, callback, options);
};

const removeUnusedImages = (
  src = absoluteSrcPath,
  dest = absoluteDestPath,
  callback,
  {
    imgRe = /.*\/(img\/.+)/g,
    showRemovedImg = true,
    hooks = {},
  } = {},
) => {
  ensureRunFunc(hooks.beforeRemoveUnusedImage);
  logger.await('remove unused image');
  if (isProd()) {
    const imagePathArray = keys(Cach.get('image'));
    for (let index = 0; index < imagePathArray.length; index += 1) {
      const imageKey = imagePathArray[index];
      const imagePath = imageKey.replace(imgRe, '$1');
      const wxmlKeyArray = keys(Cach.get('wxml'));
      let isUsed = false;

      for (let innerIndex = 0; innerIndex < wxmlKeyArray.length; innerIndex += 1) {
        const wxmlKey = wxmlKeyArray[innerIndex];
        const wxmlContent = Cach.get('wxml', wxmlKey);
        if (wxmlContent.indexOf(imagePath) > -1) {
          isUsed = true;
          break;
        }
      }

      if (!isUsed) {
        removeS(path.join(dest, imageKey));
        if (showRemovedImg) {
          console.note(`remove ${imageKey}`);
        }
      }
    }
  }
  logger.success('remove unused image');
  ensureRunFunc(hooks.afterRemoveUnusedImage);
  ensureRunFunc(callback);
};

const compileJsFile = (
  src,
  dest,
  {
    hooks = {},
  } = {},
) => {
  if (typeof src === 'string') {
    ensureRunFunc(hooks.start, src);
    let { code, ast, error } = babelTransform(readS(src));
    code = wxTraverse(ast, src);
    code = isProd() ? uglify(code) : code;
    compileCompressFile(src, dest, {
      compress: false,
      input: code,
    });
    ensureRunFunc(hooks.end, code, src, ast);
  }
};

const compileJsFiles = (
  src = absoluteSrcPath,
  dest = absoluteDestPath,
  callback,
  {
    hooks = {},
  } = {},
) => {
  ensureRunFunc(hooks.beforeJsCompile);
  logger.await('compile js');
  const entry = searchFiles(/\.(?:js)$/, src);
  const spinner = new Spinner('compiling...');
  Cach.init('js', entry);
  keys(entry, (key) => {
    compileJsFile(entry[key], key, {
      hooks: {
        end() {
          spinner.say(key);
        },
      },
    });
  }, {
    // => test file length
    // start: 0,
    // end: 1,
  });
  spinner.end();
  logger.success('compile js');
  ensureRunFunc(hooks.afterJsCompile);
  ensureRunFunc(callback);
};

const minImageFiles = async (
  src = absoluteSrcPath,
  dest = absoluteDestPath,
  callback,
  options = {},
) => {
  const {
    quality = '65-80',
    hooks = {},
  } = options;

  ensureRunFunc(hooks.beforeMinImage);
  logger.await('compile image');
  Cach.init('image', searchFiles(/\.(?:jpe?g|png|gif|svg)$/, src));
  const dirArray = keys(Cach.get('image', DIR));
  const spinner = new Spinner('compiling...');
  for (let index = 0; index < dirArray.length; index += 1) {
    const dir = dirArray[index];
    await minImage(`${src}${dir}`, `${dest}${dir}`, options);
    spinner.say(dir);
  }
  spinner.end();
  logger.success('compile image');
  ensureRunFunc(hooks.afterMinImage);
  ensureRunFunc(callback);
};

const runWatcher = async (
  src = absoluteSrcPath,
  dest = absoluteDestPath,
  callback,
  {
    srcfix = SRC,
    destfix = DEST,
  } = {},
) => {
  await clearConsole();

  if (isProd()) {
    return ensureRunFunc(callback());
  }

  const unlinkFunc = (path) => {
    if (initial) {
      const time = Date.now();
      const suffix = getSuffix(path);
      const shortPath = path.replace(src, '');
      logStart(`[-] ${suffix} ${shortPath}`);
      path = path.replace(srcfix, destfix);
      removeS(path);
      logEnd(`[-] ${suffix} ${shortPath}`, time);
    }
  };

  const modifyFunc = (action = '[*]') => async (path, stat) => {
    const pathKey = path.replace(src, '');
    const suffix = getSuffix(pathKey);
    const time = Date.now();
    const destPath = `${dest}${pathKey}`.replace(fileNameRe, '');
    const hooks = {
      start() {
        logStart(`${action} ${suffix} ${pathKey}`);
      },
      end() {
        logEnd(`${action} ${suffix} ${pathKey}`, time);
      },
    };

    if (initial && suffix) {
      console.log(stat);
      switch (suffix) {
        case 'js':
          compileJsFile(path, pathKey, { hooks, showDetail: false });
          break;
        case 'wxml':
          compileCompressFile(path, pathKey, { hooks });
          break;
        case 'json':
          const jsonHooks = Object.assign({}, hooks, {
            willRewrite: jsonWillRewriteHook,
          });
          compileCompressFile(path, pathKey, { hooks: jsonHooks });
          break;
        case 'wxss':
          webpackWxssFiles({ [pathKey]: path }, { hooks });
          break;
        case 'jpeg':
        case 'jpg':
        case 'png':
        case 'svg':
        case 'gif':
          await minImage(path, destPath, { hooks });
          break;
      }
    }
  };

  chokidar.watch(src, { ignored: /(^|[\/\\])\../ })
    .on('unlinkDir', unlinkFunc)
    .on('unlink', unlinkFunc)
    .on('add', modifyFunc('[+]'))
    .on('change', modifyFunc())
    .on('addDir', (path) => {});

  ensureRunFunc(callback());
};

const compileStart = (
  src = absoluteSrcPath,
  dest = absoluteDestPath,
  callback,
) => {
  time = Date.now();
  removeS(dest);
  ensureRunFunc(callback);
};

const compileFinish = async (
  src = absoluteSrcPath,
  dest = absoluteDestPath,
  callback,
) => {
  if (isDev()) {
    await clearConsole();
    logEnd('compile', time);
    console.log();
    console.log(color.magenta('watching file changes...'));
    ensureRunFunc(callback);
  } else {
    logEnd('compile', time);
  }
  initial = true;
};

const resolveOptions = (options = {}) => {
  const {
    srcName = '',
    destName = '',
  } = options;

  if (srcName) {
    SRC = srcName;
    absoluteSrcPath = path.join(__dirname, buildRelativeDir, `${SRC}`);
    delete options.srcName;
  }

  if (destName) {
    destName = /^\//.test(destName) ? destName : `/${destName}`;
    DEST = destName;
    absoluteDestPath = path.join(__dirname, buildRelativeDir, `${DEST}`);
    absoluteDestNpmPath = path.join(__dirname, buildRelativeDir, `${DEST}/npm`);
    delete options.destName;
  }
  return options;
};

const STEP_START = [
  compileStart,
  runWatcher,
];

const STEP_PROCESS = [
  compileWxmlFiles,
  compileJsonFiles,
  compileJsFiles,
  minImageFiles,
  compileWxssFiles,
  removeUnusedImages,
];

const STEP_END = [
  compileFinish,
];

const STEP_SERIES = [
  ...STEP_START,
  ...STEP_PROCESS,
  ...STEP_END,
];

module.exports = async ({
  src = absoluteSrcPath,
  dest = absoluteDestPath,
  options = {},
  hooks = {},
} = {}) => {
  resolveOptions(options);
  options = Object.assign({}, options, { hooks });
  logger = Logger(STEP_PROCESS.length);

  const wrapper = (fn, index) => (callback) => (
    fn(src, dest, callback, options)
  );

  async.series(STEP_SERIES.map((fn, index) => (
    wrapper(fn, index)
  )), catchError(() => {
    //...
  }));
};
