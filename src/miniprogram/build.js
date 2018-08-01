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
} = require('./utils');

const {
  SRC,
  DIR,
  DEST,
} = CONST;

let initial = false;
Cach.init('node_modules');
const absoluteSrcPath = path.join(__dirname, '../', `${SRC}`);
const absoluteDestPath = path.join(__dirname, '../', `${DEST}`);
const absoluteDestNpmPath = path.join(__dirname, '../', `${DEST}/npm`);

const testWrite = ast => write('aa.json', JSON.stringify(ast));

const resolveNpmPath = (
  props = {},
  options = {},
) => {
  let {
    args = [],
    reqSrc = '',
    prefixPath = '',
  } = props;
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
  let moduleName = replaceSlash(firstArgsValue);
  const isModuleCall = /^[~@a-zA-Z]/.test(moduleName);

  if (/^~/.test(moduleName)) {
    moduleName = moduleName.slice(1);
  }

  const copyCachModule = (name = moduleName) => {
    nodeModulePath = isModuleCall
      ? resolve.sync(name, path.join(__dirname, '../'))
      : path.resolve(nodeModulePath, '../', name);
    const destNpmPath = `${DEST}/npm`;
    nodeModulePath = replaceSlash(nodeModulePath);
    const npmPath = nodeModulePath.replace(/([\/]node_modules)/, destNpmPath);

    if ((isModuleCall || module) && /\.js$/.test(nodeModulePath) && !Cach.get('node_modules', nodeModulePath)) {
      Cach.set('node_modules', nodeModulePath, 1);
      copy(nodeModulePath, npmPath, catchError(() => {
        return wxTraverse(babelTransform(readS(npmPath)).ast, npmPath, absoluteDestNpmPath, {
          nodeModulePath,
          module: true,
          debug: true,
        });
      }));
    }
  };
  
  if (isModuleCall) {
    const relativeSrcPath = replaceSlash(reqSrc.replace(`${prefixPath}/`, ''));
    const prefix = [];
    relativeSrcPath.replace(/[\/]/g, () => (
      prefix.push('../')
    ));
    copyCachModule();
    const sliceIndex = nodeModulePath.indexOf(moduleName) + moduleName.length;
    const relativeFilePath = nodeModulePath.slice(sliceIndex);
    return `${prefix.join('') || './'}${module ? '' : 'npm/'}${moduleName}${relativeFilePath}`;
  } else if (!/\.js$/.test(moduleName)) {
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
        copyCachModule(indexPath || firstArgsValue);
      }
      return indexPath;
    }
  } else if (module) {
    copyCachModule(firstArgsValue);
  }
  return firstArgsValue;
};

const wxTraverse = (
  ast,
  reqSrc,
  prefixPath = absoluteSrcPath,
  options = {},
) => {
  const { nodeModulePath, module, aa } = options;
  babelTraverse(ast, {
    CallExpression({ node }) {
      if (node) {
        const { callee = {} } = node;
        const nodeArgs = node.arguments || [];
        const { loc = {} } = callee;
        const { identifierName = '' } = loc;
        if (identifierName === 'require') {
          nodeArgs[0].value = resolveNpmPath({
            args: nodeArgs,
            reqSrc,
            prefixPath,
          }, options) || nodeArgs[0].value;
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
          initArgs[0].value = resolveNpmPath({
            args: initArgs,
            reqSrc,
            prefixPath,
          }, options) || initArgs[0].value;
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
  } = options;
  const destFile = path.join(__dirname, `../${dest}${destPath}`);
  if (typeof filePath === 'string') {
    try {
      ensureRunFunc(hooks.willCompress, filePath, destPath);
      const file = compressFile(input || readS(filePath), compress);
      const hookArgs = [file, filePath, destFile];
      ensureRunFunc(hooks.didCompress, ...hookArgs);
      ensureRunFunc(hooks.willCopy, ...hookArgs);
      copy(filePath, destFile, catchError(() => {
        ensureRunFunc(hooks.didCopy, ...hookArgs);
        ensureRunFunc(hooks.willRewrite, ...hookArgs);
        write(destFile, file, { encoding });
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
const copyCompressFiles = (re, hooks = {}) => (compress = true) => {
  const entry = searchFiles(re, absoluteSrcPath);
  ensureRunFunc(hooks.start, entry, absoluteSrcPath);
  keys(entry, key => copyCompressFile(entry[key], key, { compress, hooks }));
  ensureRunFunc(hooks.end, absoluteSrcPath);
};

const copyJsonFiles = copyCompressFiles(/\.(?:json)$/, {
  start(json) {
    logStart('copy json');
    Cach.init('json', json);
  },
  didCopy(file, filePath) {
    if (/app\.json$/.test(filePath)) {
      Cach.set('wxml', filePath, file);
    }
  },
  end() {
    logEnd('copy json');
  },
});

const copyWxmlFiles = copyCompressFiles(/\.(?:wxml)$/, {
  start() {
    logStart('copy wxml');
    Cach.init('wxml', {});
  },
  didRewrite(file, filePath) {
    Cach.set('wxml', filePath, file);
  },
  end() {
    logEnd('copy wxml');
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

  if (ensureRunFunc(hooks.start) === false) {
    logStart('compile wxss');
  }

  if (webpackFlag) {
    webpack(cssConfig, catchError(() => {
      if (ensureRunFunc(hooks.end) === false) {
        logEnd('compile wxss');
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

const copyJsFiles = (options = {}) => {
  const entry = searchFiles(/\.(?:js)$/, absoluteSrcPath);
  Cach.init('js', entry);
  logStart('copy js');
  keys(entry, (dest) => {
    copyJsFile(entry[dest], dest);
  }, {
    // start: 0,
    // end: 1,
  });
  logEnd('copy js');
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

  if (clearDest) {
    removeS(dest);
  }

  logStart('copy images');
  Cach.init('image', searchFiles(/\.(?:jpe?g|png|gif)$/, src));
  const dirArray = keys(Cach.get('image', DIR));
  for (let index = 0; index < dirArray.length; index += 1) {
    const dir = dirArray[index];
    await minImage(`${src}${dir}`, `${dest}${dir}`, options);
    // console.log(color.green(`copy images in ${dir} SUCCESS...`));
  }
  logEnd('copy images');
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

module.exports = async () => {
  runWatcher();
  removeS(absoluteDestPath);
  copyWxmlFiles();
  copyJsonFiles(isProd());
  await minImageFiles();
  copyJsFiles();
  copyWxssFiles({
    callback: async () => {
      removeUnusedImages();
      await clearConsole();
      console.log(color.magenta('watching file changes...'));
      initial = true;
    },
  });
};
