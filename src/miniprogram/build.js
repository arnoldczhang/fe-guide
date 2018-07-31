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
  uglify,
  minImage,
  searchFiles,
  compressFile,
  ensureRunFunc,
  babelTransform,
  babelTraverse,
  babelGenerator,
  catchError,
  getWebpackCssConfig,
  replaceSlash,
  keys,
} = require('./utils')();

const {
  CODE,
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
  const moduleName = replaceSlash(firstArgsValue);
  const isModuleCall = /^[@a-zA-Z]/.test(moduleName);

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
    Cach.init('json', json);
  },
  didCopy(file, filePath) {
    if (/app\.json$/.test(filePath)) {
      Cach.set('wxml', filePath, file);
    }
  },
  end() {
    console.log(color.green(`copy json files SUCCESS...`));
  },
});

const copyWxmlFiles = copyCompressFiles(/\.(?:wxml)$/, {
  start() {
    Cach.init('wxml', {});
  },
  didRewrite(file, filePath) {
    Cach.set('wxml', filePath, file);
  },
  end() {
    console.log(color.green(`copy wxml files SUCCESS...`));
  },
});

const copyCssFile = (
  entry = {},
  options = {},
) => {
  const {
    callback = null,
    webpackFlag = true,
  } = options;
  const cssConfig = getWebpackCssConfig(entry, options);
  if (webpackFlag) {
    webpack(cssConfig, catchError(() => {
      console.log(color.green('copy wxss SUCCESS...'));
      ensureRunFunc(callback);
    }));
  }
  return cssConfig;
};

const copyCssFiles = async (options = {}) => {
  const entry = searchFiles(/\.(?:wxss)$/, absoluteSrcPath);
  delete entry[DIR];
  Cach.init('wxss', entry);
  return copyCssFile(entry, options);
};

const removeUnusedImages = (
  dest = absoluteDestPath,
  imgRe = /.*\/(img\/.+)/g,
) => {
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
};

const copyJsFile = (
  src,
  dest,
  options = {},
) => {
  if (typeof src === 'string') {
    let { code, ast, error } = babelTransform(readS(src));
    code = wxTraverse(ast, src);
    console.log(color.green(`* copy ${dest} SUCCESS...`));
    if (process.env.NODE_ENV === CODE.PROD) {
      code = uglify(code);
    }
    copyCompressFile(src, dest, {
      compress: false,
      input: code,
    });
  }
};

const copyJsFiles = (options = {}) => {
  const entry = searchFiles(/\.(?:js)$/, absoluteSrcPath);
  Cach.init('js', entry);
  console.log(color.green(`copy js files...`));
  keys(entry, (dest) => {
    copyJsFile(entry[dest], dest);
  }, {
    // start: 0,
    // end: 1,
  });
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

  Cach.init('image', searchFiles(/\.(?:jpe?g|png|gif)$/, src));
  const dirArray = keys(Cach.get('image', DIR));
  for (let index = 0; index < dirArray.length; index += 1) {
    const dir = dirArray[index];
    await minImage(`${src}${dir}`, `${dest}${dir}`, options);
    console.log(color.green(`copy images in ${dir} SUCCESS...`));
  }
  ensureRunFunc(callback);
};

const runWatcher = (
  src = absoluteSrcPath,
) => {
  // FIXME
  const watcher = chokidar.watch(src, { ignored: /(^|[\/\\])\../ });
  watcher.on('add', (path, stats) => {
    if (initial) {
      
    }
  }).on('change', (path, stats) => {
    const pathKey = path.replace(src, '');
    const suffix = (/\.([^\.]+)$/.exec(pathKey) || [])[1];
    if (initial && suffix) {
      switch(suffix) {
        case 'js':
          console.log(Cach.get('js'), pathKey, Cach.get('js', pathKey));
          // copyJsFile();
          break;
        case 'wxml':
          break;
        case 'wxss':
          break;
        case 'json':
          break;
      }
    }
  });
};

module.exports = async () => {
  runWatcher();
  copyWxmlFiles();
  copyJsonFiles();
  await minImageFiles();
  copyJsFiles();
  copyCssFiles({
    callback() {
      removeUnusedImages();
      console.log('watching...');
      initial = true;
    },
  });
};
