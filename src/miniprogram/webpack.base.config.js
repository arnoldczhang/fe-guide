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
  searchFiles,
  compressFile,
  ensureRunFunc,
  babelTransform,
  babelTraverse,
  babelGenerator,
  catchError,
  getWebpackCssConfig,
  readS,
  statS,
  write,
  copy,
  keys,
} = require('./utils');

const DEST = '/destination';
const nodeModuleCach = {};
const srcPath = path.join(__dirname, '../src');
const absoluteDestNpmPath = path.join(__dirname, '../', `${DEST}/npm`);

const wxTraverse = (
  ast,
  src,
  prefixPath = srcPath,
  options = {},
) => {
  const {
    module = false,
    debug = false,
  } = options;
  let {
    nodeModulePath,
  } = options;

  babelTraverse(ast, {
    CallExpression({ node }) {
      if (node) {
        const { callee = {} } = node;
        const args = node.arguments || [];
        const { loc = {} } = callee;
        const { identifierName = '' } = loc;

        if (identifierName === 'require' && args.length) {
          const moduleName = args[0].value;
          const isModuleCall = /^[@a-zA-Z]/.test(moduleName);
          if (module || isModuleCall) {
            const relativeSrcPath = src.replace(`${prefixPath}/`, '');
            const prefix = [];
            relativeSrcPath.replace(/\//g, () => (
              prefix.push('../')
            ));

            // console.log(nodeModulePath, moduleName);
            if (isModuleCall) {
              nodeModulePath = resolve.sync(moduleName, path.join(__dirname, '../'));
            } else {
              nodeModulePath = path.resolve(nodeModulePath, '../', moduleName);
            }
            const destNpmPath = `${DEST}/npm`;
            const npmPath = nodeModulePath.replace(/(\/node_modules)/, destNpmPath);

            if (!nodeModuleCach[nodeModulePath]) {
              copy(nodeModulePath, npmPath, catchError(() => {
                nodeModuleCach[nodeModulePath] = 1;
                wxTraverse(babelTransform(readS(npmPath)).ast, npmPath, absoluteDestNpmPath, {
                  nodeModulePath,
                  module: true,
                  debug: true,
                });
              }));
            }

            if (isModuleCall) {
              const sliceIndex = nodeModulePath.indexOf(moduleName) + moduleName.length;
              const relativeFilePath = nodeModulePath.slice(sliceIndex);
              args[0].value = `${prefix.join('') || './'}npm/${moduleName}${relativeFilePath}`;
            }
          } else {
            try {
              const npmStat = statS(path.resolve(src, '../', moduleName));
              if (npmStat.isDirectory()) {
                args[0].value = `${moduleName}/index.js`;
              }
            } catch (err) {
              args[0].value = `${moduleName}.js`;
            }
          }
        }
      }
    },

    VariableDeclarator({ node }) {
      // if (node) {
      //   let { init = {} } = node;
      //   init = init || {};
      //   const { callee = {} } = init;
      //   const args = init.arguments || [];
      //   if (callee.name === 'require' && args.length) {
      //     const moduleName = args[0].value;
      //     // console.log(moduleName);
      //     if (/^[@a-zA-Z]/.test(moduleName)) {
      //       const relativeSrcPath = src.replace(`${prefixPath}/`, '');
      //       const prefix = [];
      //       relativeSrcPath.replace(/\//g, () => (
      //         prefix.push('../')
      //       ));
      //       const nodeModulePath = resolve.sync(moduleName, path.join(__dirname, '../'));
      //       const destNpmPath = `${DEST}/npm`;
      //       const npmPath = nodeModulePath.replace(/(\/node_modules)/, destNpmPath);
      //       if (!nodeModuleCach[nodeModulePath]) {
      //         copy(nodeModulePath, npmPath, catchError(() => {
      //           nodeModuleCach[nodeModulePath] = 1;
      //           // wxTraverse(babelTransform(readS(npmPath)).ast, npmPath, destNpmPath, {
      //           //   debug: true,
      //           // });
      //         }));
      //       }
      //       const sliceIndex = nodeModulePath.indexOf(moduleName) + moduleName.length;
      //       const relativeFilePath = nodeModulePath.slice(sliceIndex);
      //       args[0].value = `${prefix.join('') || './'}npm/${moduleName}${relativeFilePath}`;
      //     } else {
      //       try {
      //         const npmStat = statS(path.resolve(src, '../', moduleName));
      //         if (npmStat.isDirectory()) {
      //           args[0].value = `${moduleName}/index.js`;
      //         }
      //       } catch (err) {
      //         args[0].value = `${moduleName}.js`;
      //       }
      //     }
      //   }
      // }
    },
  });
  return babelGenerator(ast).code;
};

const copyCompressFile = (
  filePath,
  destPath,
  options = {},
) => {
  const {
    compress = true,
    dest = DEST,
    encoding = 'utf8',
    input = '',
  } = options;
  const destFile = path.join(__dirname, `../${dest}${destPath}`);
  try {
    const file = compressFile(input || readS(filePath), compress);
    copy(filePath, destFile, catchError(() => {
      write(destFile, file, { encoding });
    }));
  } catch (err) {
    console.log(color.red(err));
  }
};

const copyCompressFiles = (re, hooks = {}) => (compress = true) => {
  const entry = searchFiles(re, srcPath);
  ensureRunFunc(hooks.start, srcPath);
  keys(entry, key => (
    copyCompressFile(entry[key], key, { compress })
  ));
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
  copy(srcPath + '/img', path.join(__dirname, '../destination/img'));
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
    // write('aa.json', JSON.stringify(ast));
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
