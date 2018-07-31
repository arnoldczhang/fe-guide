/* eslint-disable */
const path = require('path');
const fsevents = require('fsevents');
const webpack = require('webpack');
const color = require('chalk');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const resolve = require('resolve');

const {
  CODE,
  SRC,
  DIR,
  DEST,
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
  readS,
  removeS,
  statS,
  write,
  watch,
  copy,
  keys,
} = require('./utils');

let imageCach = {};
const nodeModuleCach = {};
const wxmlCach = {};
const jsonCach = {};
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

    if ((isModuleCall || module) && /\.js$/.test(nodeModulePath) && !nodeModuleCach[nodeModulePath]) {
      nodeModuleCach[nodeModulePath] = 1;
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
  ensureRunFunc(hooks.start, absoluteSrcPath);
  keys(entry, (key) => {
    const dest = entry[key];
    ensureRunFunc(hooks.willCompress, key, dest);
    copyCompressFile(dest, key, { compress, hooks });
  });
  ensureRunFunc(hooks.end, absoluteSrcPath);
};

const copyJsonFiles = copyCompressFiles(/\.(?:json)$/, {
  didCopy(file, filePath) {
    if (/app\.json$/.test(filePath)) {
      wxmlCach[filePath] = file;
    }
  },
  end() {
    console.log(color.green(`copy json files SUCCESS...`));
  },
});

const copyWxmlFiles = copyCompressFiles(/\.(?:wxml)$/, {
  didRewrite(file, filePath) {
    wxmlCach[filePath] = file;
  },
  end() {
    console.log(color.green(`copy wxml files SUCCESS...`));
  },
});

const copyCssFiles = async (options = {}) => {
  const {
    callback = null,
    webpackFlag = true,
  } = options;
  const entry = searchFiles(/\.(?:wxss)$/, absoluteSrcPath);
  delete entry[DIR];
  const cssConfig = getWebpackCssConfig(entry, options);
  if (webpackFlag) {
    webpack(cssConfig, catchError(() => {
      console.log(color.green('copy wxss SUCCESS...'));
      ensureRunFunc(callback);
    }));
  }
  return cssConfig;
};

const removeUnusedImages = (
  dest = absoluteDestPath,
) => {
  const imagePathArray = keys(imageCach);
  for (let index = 0; index < imagePathArray.length; index += 1) {
    const imageKey = imagePathArray[index];
    const imagePath = imageKey.replace(/.*\/(img\/.+)/g, '$1');
    const wxmlKeyArray = keys(wxmlCach);
    let isUsed = false;

    if (imagePath === DIR) {
      continue;
    }

    for (let innerIndex = 0; innerIndex < wxmlKeyArray.length; innerIndex += 1) {
      const wxmlKey = wxmlKeyArray[innerIndex];
      const wxmlContent = wxmlCach[wxmlKey];
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

const copyJsFiles = (options = {}) => {
  const entry = searchFiles(/\.(?:js)$/, absoluteSrcPath);
  console.log(color.green(`copy js files...`));
  keys(entry, (dest) => {
    const src = entry[dest];
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

  imageCach = searchFiles(/\.(?:jpe?g|png|gif)$/, src);
  const dirArray = keys(imageCach[DIR]);
  for (let index = 0; index < dirArray.length; index += 1) {
    const dir = dirArray[index];
    await minImage(`${src}${dir}`, `${dest}${dir}`, options);
    console.log(color.green(`copy images in ${dir} SUCCESS...`));
  }
  ensureRunFunc(callback);
};

const runWatch = () => {
  console.log('watching files...');
  const watcher = fsevents(__dirname);
  watcher.on('fsevent', (path, flags, id) => {
    console.log(path, flags, id);
  });
  watcher.on('change', (path, info) => {
    console.log(info);
  });
  watcher.start();
};

module.exports = async () => {
  runWatch();
  // copyWxmlFiles();
  // copyJsonFiles();
  // await minImageFiles();
  // copyCssFiles({
  //   callback() {
  //     copyJsFiles();
  //     removeUnusedImages();
  //     runWatch();
  //   },
  // });
};
