/* eslint-disable */
// const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const color = require('chalk');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const uglifyJS = require('uglify-js');
const {
  promisify,
} = require('util');
const resolve = promisify(require('resolve'));

const {
  CODE,
  DEST,
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
    // console.log(reqSrc, prefixPath);
    nodeModulePath = isModuleCall
      ? resolve.sync(name, path.join(__dirname, '../'))
      : path.resolve(nodeModulePath, '../', name);
    const destNpmPath = `${DEST}/npm`;
    nodeModulePath = replaceSlash(nodeModulePath);
    const npmPath = nodeModulePath.replace(/([\/]node_modules)/, destNpmPath);

    if ((isModuleCall || module) && !nodeModuleCach[nodeModulePath]) {
      copy(nodeModulePath, npmPath, catchError(() => {
        nodeModuleCach[nodeModulePath] = 1;
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
    return `${prefix.join('') || './'}npm/${moduleName}${relativeFilePath}`;
  } else if (!/\.js$/.test(moduleName)) {
    try {
      const npmStat = statS(path.resolve(src, '../', moduleName));
      if (npmStat.isDirectory()) {
        return `${moduleName}/index.js`;
      }
    } catch (err) {
      return `${moduleName}.js`;
    } finally {
      if (nodeModulePath) {
        copyCachModule(firstArgsValue);
      }
    }
  }
  return firstArgsValue;
};

const wxTraverse = (
  ast,
  reqSrc,
  prefixPath = srcPath,
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
    write(reqSrc, code);
    // console.log(reqSrc);
    // return wxTraverse(ast, reqSrc, absoluteDestNpmPath, {
    //   nodeModulePath,
    //   module: true,
    //   debug: true,
    // });
    // console.log(reqSrc, absoluteDestNpmPath, reqSrc.replace(`${absoluteDestNpmPath}/`, ''));
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
  // start: ,
  end(src) {
    console.log(color.green(`copy json files SUCCESS...`));
  },
  // willCompress: ,
  // didCompress: ,
  // willCopy: ,
  // didCopy: ,
  // end: ,
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
    mode = CODE.DEV,
    callback = null,
    webpackFlag = true,
  } = options;
  const entry = searchFiles(/\.(?:wxss)$/, srcPath);
  const cssConfig = getWebpackCssConfig(mode, entry);

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
  const {
    mode = CODE.DEV,
  } = options;
  const entry = searchFiles(/\.(?:js)$/, srcPath);
  console.log(color.green(`copy js files...`));
  keys(entry, (dest) => {
    const src = entry[dest];
    let { code, ast, error } = babelTransform(readS(src));

    if (mode === CODE.PROD) {
      const uglifyRes = uglifyJS.minify(code);
      code = uglifyRes.code;
      if (uglifyRes.error) {
        return console.log(color.red(uglifyRes.error));
      }
    }
    code = wxTraverse(ast, src);
    console.log(color.green(`* copy ${dest} SUCCESS...`));
    copyCompressFile(src, dest, {
      compress: false,
      input: code,
    });
  }, {
    start: 0,
    end: 1,
  });
};

(async () => {
  // webpack([copyCssFiles()], (err) => {
  //   if (err) {
  //     return console.log(color.red(err));
  //   }
  //   console.log(color.green('wxss compiled SUCESS...'))
  // });
  copyCssFiles();
  copyJsFiles();
  copyJsonFiles();
  copyWxmlFiles();
})();


// const copyJsAndCssFiles = () => [copyCssFiles(), copyJsFiles()];
// module.exports = copyJsAndCssFiles();
