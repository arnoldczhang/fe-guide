/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const color = require('chalk');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const resolve = require('resolve');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const readline = require('readline');

const {
  readFileSync: readS,
  readdirSync,
  copy,
  writeFile: write,
  statSync: statS,
  removeSync: removeS,
} = fs;

const {
  CONST,
  Cach,
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
  fixWavy,
  getPathBack,
} = require('./utils');

const {
  SRC,
  DIR,
  DEST,
} = CONST;

let initial = false;

const jsRe = /\.js$/;
const npmPrefixRe = /^[~_@a-zA-Z]/;
Cach.init('node_modules');
const absoluteSrcPath = path.join(__dirname, '../', `${SRC}`);
const absoluteDestPath = path.join(__dirname, '../', `${DEST}`);
const absoluteDestNpmPath = path.join(__dirname, '../', `${DEST}/npm`);
const getRelativeFilePath = (src, prefix) => replaceSlash(src.replace(`${prefix}/`, ''));

const copyCachModule = (
  name,
  props = {},
) => {
  const {
    module = false,
    isModuleCall = false,
    fixSuffix = false,
  } = props;
  let dirPath;
  let { nodeModulePath = '' } = props;
  nodeModulePath = isModuleCall
    ? resolve.sync(name, path.join(__dirname, '../'))
    : path.resolve(nodeModulePath, '../', name);

  const destNpmPath = `${DEST}/npm`;
  nodeModulePath = replaceSlash(nodeModulePath);
  let npmPath = nodeModulePath.replace(/([\/]node_modules)/, destNpmPath);

  const traversePathCode = (
    mPath = nodeModulePath,
    nPath = npmPath,
  ) => {
    wxTraverse(babelTransform(readS(nPath)).ast, nPath, absoluteDestNpmPath, {
      nodeModulePath: mPath,
      module: true,
      debug: true,
    });
  };

  if (fixSuffix) {
    nodeModulePath = nodeModulePath.replace(jsRe, '');
    dirPath = nodeModulePath.replace(/\/[^\/]+$/, '');
    npmPath = npmPath.replace(/\/[^\/]+$/, '');
  }

  if ((isModuleCall || module) && !Cach.get('node_modules', nodeModulePath)) {
    if (!jsRe.test(nodeModulePath)) {
      try {
        Cach.set('node_modules', nodeModulePath, 1);
        const stat = statS(dirPath);
        if (stat.isDirectory()) {
          const files = searchFiles(/\.(?:js|wxml|json|wxss)$/, npmPath);
          keys(files, (key) => {
            if (key === DIR) return;
            const dest = files[key];
            const src = path.join(dirPath, key);
            copy(src, dest, catchError(() => {
              if (jsRe.test(src)) {
                traversePathCode(src, dest);
              }
            }));
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      Cach.set('node_modules', nodeModulePath, 1);
      copy(nodeModulePath, npmPath, catchError(() => {
        traversePathCode();
      }));
    }
  }

  if (fixSuffix) {
    return nodeModulePath.replace(/^[\s\S]+node_modules\//, '');
  }
  return nodeModulePath;
};

const resolveNpmPath = (
  args = [],
  reqSrc = '',
  prefixPath = '',
  options = {},
) => {
  const {
    module = false,
    debug = false,
  } = options;
  let {
    nodeModulePath,
  } = options;
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
      const npmStat = statS(path.resolve(reqSrc, '../', moduleName));
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
  reqSrc,
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
          nodeArgs[0].value = resolveNpmPath(nodeArgs, reqSrc, prefixPath, options)
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
          initArgs[0].value = resolveNpmPath(initArgs, reqSrc, prefixPath, options)
            || initArgs[0].value;
        }
      }
    },
  });
  const code = babelGenerator(ast).code;
  if (module) {
    write(reqSrc, uglify(code));
  }
  return code;
};

const copyCompressFile = (
  filePath,
  destPath,
  options = {},
) => {
  const {
    hooks = {},
    compress = true,
    dest = DEST,
    encoding = 'utf8',
    input = '',
    src,
  } = options;
  const destFile = path.join(__dirname, `../${dest}${destPath}`);
  if (typeof filePath === 'string') {
    try {
      ensureRunFunc(hooks.willCompress, filePath, destPath);
      const file = compressFile(input || readS(filePath), compress);
      const hookArgs = [file, filePath, destFile, src];
      ensureRunFunc(hooks.didCompress, ...hookArgs);
      ensureRunFunc(hooks.willCopy, ...hookArgs);
      copy(filePath, destFile, catchError(() => {
        ensureRunFunc(hooks.didCopy, ...hookArgs);
        const lastResult = ensureRunFunc(hooks.willRewrite, ...hookArgs);
        write(destFile, lastResult || file, { encoding });
        ensureRunFunc(hooks.didRewrite, ...hookArgs);
      }));
    } catch (err) {
      console.log(color.red(err));
    }
  }
};

/**
 * copyCompressFiles
 * @param hooks = {
 *   start,
 *   willCompress,
 *   didCompress,
 *   willCopy,
 *   didCopy,
 *   willRewrite,
 *   didRewrite,
 *   end,
 * };
 */
const copyCompressFiles = (re, hooks = {}) => (
  compress = true,
  src = absoluteSrcPath,
) => {
  const entry = searchFiles(re, src);
  ensureRunFunc(hooks.start, entry, src);
  keys(entry, key => copyCompressFile(entry[key], key, { compress, hooks, src }));
  ensureRunFunc(hooks.end, src);
};

const copyJsonFiles = copyCompressFiles(/\.(?:json)$/, {
  start(json) {
    this.time = Date.now();
    logStart('copy json');
    Cach.init('json', json);
  },
  didCopy(file, filePath) {
    if (/app\.json$/.test(filePath)) {
      Cach.set('wxml', filePath, file);
    }
  },
  willRewrite(file, ...args) {
    try {
      const json = JSON.parse(file);
      const { usingComponents } = json;
      const [filePath, destFile, src] = args;
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
  },
  end() {
    logEnd('copy json', this.time);
  },
});

const copyWxmlFiles = copyCompressFiles(/\.(?:wxml)$/, {
  start() {
    this.time = Date.now();
    logStart('copy wxml');
    Cach.init('wxml', {});
  },
  didRewrite(file, filePath) {
    Cach.set('wxml', filePath, file);
  },
  end() {
    logEnd('copy wxml', this.time);
  },
});

const compileWxssFiles = (
  entry = {},
  options = {},
) => {
  const {
    callback = null,
    webpackFlag = true,
    hooks = {},
  } = options;
  const cssConfig = getWebpackCssConfig(entry, options);
  const time = Date.now();

  if (ensureRunFunc(hooks.start) === false) {
    logStart('compile wxss');
  }

  if (webpackFlag) {
    webpack(cssConfig, catchError(() => {
      if (ensureRunFunc(hooks.end) === false) {
        logEnd('compile wxss', time);
      }
      ensureRunFunc(callback);
    }));
  }
  return cssConfig;
};

const copyWxssFiles = async (options = {}) => {
  const entry = searchFiles(/\.(?:wxss)$/, absoluteSrcPath);
  delete entry[DIR];
  Cach.init('wxss', entry);
  return compileWxssFiles(entry, options);
};

const removeUnusedImages = (
  dest = absoluteDestPath,
  imgRe = /.*\/(img\/.+)/g,
) => {
  if (isProd()) {
    const imagePathArray = keys(Cach.get('image'));
    for (let index = 0; index < imagePathArray.length; index += 1) {
      const imageKey = imagePathArray[index];
      const imagePath = imageKey.replace(imgRe, '$1');
      const wxmlKeyArray = keys(Cach.get('wxml'));
      let isUsed = false;

      if (imagePath === DIR) {
        continue;
      }

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
        console.log(color.green(`remove unused ${imageKey} SUCCESS`));
      }
    }
  }
};

const copyJsFile = (
  src,
  dest,
  options = {},
) => {
  const {
    hooks = {},
  } = options;
  if (typeof src === 'string') {
    ensureRunFunc(hooks.start, src);
    let { code, ast, error } = babelTransform(readS(src));
    code = wxTraverse(ast, src);

    if (isProd()) {
      code = uglify(code);
    } else {
      console.log(color.green(`* copy ${dest} SUCCESS...`));
    }

    copyCompressFile(src, dest, {
      compress: false,
      input: code,
    });
    ensureRunFunc(hooks.end, code, src, ast);
  }
};

const copyJsFiles = (src = absoluteSrcPath, options = {}) => {
  const entry = searchFiles(/\.(?:js)$/, src);
  const time = Date.now();
  Cach.init('js', entry);
  logStart('copy js');
  keys(entry, (dest) => {
    copyJsFile(entry[dest], dest);
  }, {
    // start: 0,
    // end: 1,
  });
  logEnd('copy js', time);
};

const minImageFiles = async (
  callback,
  options = {},
) => {
  const {
    quality = '65-80',
    src = absoluteSrcPath,
    dest = absoluteDestPath,
    clearDest = true,
  } = options;
  const time = Date.now();

  if (clearDest) {
    removeS(dest);
  }

  logStart('copy images');
  Cach.init('image', searchFiles(/\.(?:jpe?g|png|gif)$/, src));
  const dirArray = keys(Cach.get('image', DIR));
  for (let index = 0; index < dirArray.length; index += 1) {
    const dir = dirArray[index];
    await minImage(`${src}${dir}`, `${dest}${dir}`, options);
    if (isDev()) {
      console.log(color.green(`copy images in ${dir} SUCCESS...`));
    }
  }
  logEnd('copy images', time);
  ensureRunFunc(callback);
};

const runWatcher = async (
  src = absoluteSrcPath,
  dest = absoluteDestPath,
  srcfix = SRC,
  destfix = DEST,
) => {
  const replacefix = (path = '') => path.replace(srcfix, destfix);

  const unlinkFunc = (path) => {
    if (initial) {
      path = replacefix(path);
      removeS(path);
      console.log(color.green(`${path} has been removed...`))
    }
  };

  const modifyFunc = async (path, stat) => {
    const pathKey = path.replace(src, '');
    const suffix = (/\.([^\.]+)$/.exec(pathKey) || [])[1];
    if (initial && suffix) {
      switch(suffix) {
        case 'js':
          copyJsFile(path, pathKey, {
            hooks: {
              start() {
                logStart(`copy js: ${pathKey}`);
              },
              end() {
                logEnd(`copy js: ${pathKey}`);
              },
            },
          });
          break;
        case 'wxml':
        case 'json':
          copyCompressFile(path, pathKey, {
            hooks: {
              willCompress() {
                logStart(`copy ${suffix}: ${pathKey}`);
              },
              didRewrite() {
                logEnd(`copy ${suffix}: ${pathKey}`);
              },
            },
          });
          break;
        case 'wxss':
          compileWxssFiles({
            [pathKey]: path,
          }, {
            hooks: {
              start() {
                logStart(`copy wxss: ${pathKey}`);
              },
              end() {
                logEnd(`copy wxss: ${pathKey}`);
              },
            },
          });
          break;
        case 'jpeg':
        case 'jpg':
        case 'png':
        case 'gif':
          const destPath = `${dest}${pathKey}`.replace(/\/[^\/]+$/, '');
          logStart(`copy image: ${pathKey}`);
          await minImage(path, destPath);
          logEnd(`copy image: ${pathKey}`);
          break;
      }
    }
  };

  if (isProd()) {
    return;
  }

  await clearConsole();
  const watcher = chokidar.watch(src, { ignored: /(^|[\/\\])\../ });
  watcher
    .on('unlinkDir', unlinkFunc)
    .on('unlink', unlinkFunc)
    .on('add', modifyFunc)
    .on('change', modifyFunc)
    .on('addDir', (path) => {
      ;
    });
};

const compileFinish = async () => {
  if (isDev()) {
    await clearConsole();
    console.log(color.magenta('watching file changes...'));
  }
  initial = true;
};

module.exports = async () => {
  // runWatcher();
  // removeS(absoluteDestPath);
  // copyWxmlFiles();
  copyJsonFiles(isProd());
  // await minImageFiles();
  // copyJsFiles();
  // copyWxssFiles({
  //   callback: async () => {
  //     removeUnusedImages();
  //     await compileFinish();
  //   },
  // });
};
