/* eslint-disable */
// const fs = require('fs-extra');
// const through = require('through2');
const path = require('path');
const webpack = require('webpack');
const color = require('chalk');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const {
  promisify,
} = require('util');
const resolve = promisify(require('resolve'));

const {
  CODE,
  DEST,
  uglify,
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
  statS,
  write,
  copy,
  keys,
} = require('./utils');

const nodeModuleCach = {};
const srcPath = path.join(__dirname, '../src');
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
  prefixPath = srcPath,
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
          const callResult = resolveNpmPath({ args: nodeArgs, reqSrc, prefixPath }, options);
          if (callResult) {
            nodeArgs[0].value = callResult;
          }
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
          const varResult = resolveNpmPath({ args: initArgs, reqSrc, prefixPath }, options);
          if (varResult) {
            initArgs[0].value = varResult;
          }
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
  try {
    const file = compressFile(input || readS(filePath), compress);
    ensureRunFunc(hooks.didCompress, filePath, destFile);
    ensureRunFunc(hooks.willCopy, filePath, destFile);
    copy(filePath, destFile, catchError(() => {
      ensureRunFunc(hooks.didCopy, filePath, destFile);
      write(destFile, file, { encoding });
    }));
  } catch (err) {
    console.log(color.red(err));
  }
};

/**
 * copyCompressFiles
 * @param  {[Object]} hooks
 * {
 * start,
 * willCompress,
 * didCompress,
 * willCopy,
 * didCopy,
 * end
 * }
 */
const copyCompressFiles = (re, hooks = {}) => (compress = true) => {
  const entry = searchFiles(re, srcPath);
  ensureRunFunc(hooks.start, srcPath);
  keys(entry, (key) => {
    const dest = entry[key];
    ensureRunFunc(hooks.willCompress, key, dest);
    copyCompressFile(dest, key, { compress, hooks });
  });
  ensureRunFunc(hooks.end, srcPath);
};

const copyJsonFiles = copyCompressFiles(/\.(?:json)$/, {
  end(src) {
    console.log(color.green(`copy json files SUCCESS...`));
  },
});

const copyWxmlFiles = () => {
  copyCompressFiles(/\.(?:wxml)$/, {
    end(src) {
      console.log(color.green(`copy wxml files SUCCESS...`));
    },
  })();

  // FIXME 过滤需要的图片
  copyImages();
};

const copyCssFiles = (options = {}) => {
  const {
    callback = null,
    webpackFlag = true,
  } = options;
  const entry = searchFiles(/\.(?:wxss)$/, srcPath);
  const cssConfig = getWebpackCssConfig(entry);

  if (webpackFlag) {
    webpack(cssConfig, catchError(() => {
      console.log(color.green('copy wxss SUCCESS...'));
      ensureRunFunc(callback);
    }));
  }
  return cssConfig;
};

const copyImages = () => {
  copy(srcPath + '/img', path.join(__dirname, `..${DEST}/img`));
  console.log(color.green('copy img SUCCESS...'));
};

const copyJsFiles = (options = {}) => {
  const entry = searchFiles(/\.(?:js)$/, srcPath);
  console.log(color.green(`copy js files...`));
  keys(entry, (dest) => {
    const src = entry[dest];
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
  }, {
    // start: 0,
    // end: 1,
  });
};

(async () => {
  copyCssFiles();
  copyJsFiles();
  copyJsonFiles();
  copyWxmlFiles();
})();


// const copyJsAndCssFiles = () => [copyCssFiles(), copyJsFiles()];
// module.exports = copyJsAndCssFiles();
