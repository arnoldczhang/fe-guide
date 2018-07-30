const fs = require('fs-extra');
const path = require('path');
const color = require('chalk');
const babel = require("babel-core");
const generator = require('babel-generator');
const babelTraverse = require("babel-traverse");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const DEST = '/destination';

const {
  readFileSync: readS,
  copy,
  writeFile: write,
  statSync,
} = fs;
const FUNC = v => v;
const CODE = {
  DEV: 'development',
  PROD: 'production',
};

const toBufferString = (input) => {
  if (input instanceof Buffer) {
    input = input.toString();
  }

  if (input instanceof String) {
    input = input.valueOf();
  }
  return input;
};

const ensureDir = (
  dir,
  callback = FUNC,
  queue = [],
) => {
  try {
    if (dir) {
      const stat = fs.statSync(dir);
      if (!stat.isDirectory()) {
        return;
      }
    }
    while (queue.length) {
      let dir = queue.pop();
      dir = `${dir}/${dir}`;
      fs.mkdirsSync(dir);
    }
  } catch (err) {
    console.log('err', err, dir);
    ensureDir(dir.replace(/\/([^\/]+)\/?$/, (match, $1) => {
      queue.push($1);
      return '';
    }), callback, queue);
  }
  callback();
};

const searchFiles = (
  matchRe,
  src,
  result = {},
  parent = '',
) => {
  const dirRe = /[^\.]/;
  if (src && matchRe instanceof RegExp) {
    fs.readdirSync(src).forEach((file) => {
      if (dirRe.test(file) || matchRe.test(file)) {
        const fullpath = path.join(src, file);
        if (fs.statSync(fullpath).isDirectory()) {
          searchFiles(matchRe, fullpath, result, `${parent}/${file}`);
        } else if (matchRe.test(fullpath)) {
          result[`${parent}/${file}`] = fullpath;
        }
      }
    });
  }
  return result;
};

const removeComment = file => (
  file
    .replace(/(\/\*)((?!\1)[\s\S])*\*\//g, '')
    .replace(/(\/\*)((?!\*\/)[\s\S])*\*\//g, '')
    .replace(/(<!--)((?!\1)[\s\S])*-->/g, '')
    .replace(/(<!--)((?!-->)[\s\S])*-->/g, '')
    .replace(/(\s|^)\/\/.*/g, '$1')
);

const removeEmptyLine = file => (
  file
    .replace(/[\f\n\r\t\v]+/g, '')
    .replace(/ {1,}/, ' ')
);

const keys = (
  input,
  callback = FUNC,
  options = {},
) => {
  const {
    start = -1,
    end = -1,
  } = options;
  if (typeof input === 'object') {
    let keyArray = Object.keys(input);
    if (start >= 0 && end >= 0) {
      keyArray = keyArray.slice(+start, +end);
    }
    return keyArray.map(callback);
  }
  return input;
}

const lambda = (...args) => {
  let file = args.pop();
  file = toBufferString(file);

  if (file) {
    while (args.length) {
      const func = args.pop();
      file = ensureRunFunc(func, file);
    }
    return file;
  }
  return '';
};
const defaultSteps = [removeComment, removeEmptyLine];

const compressFile = (
  files,
  compress = true,
  steps = defaultSteps,
) => {
  if (compress) {
    files = Array.isArray(files) ? files : [files];
    const fileLength = files.length;
    if (!fileLength) return files;
    files = files.map(file => lambda.apply(null, steps.concat(file)));
    if (fileLength === 1) return files[0];
  }
  return files;
};

const ensureRunFunc = (input, ...args) => {
  if (input instanceof Function) {
    return input(...args);
  }
  return false;
};

const babelTransform = (input, options = {}) => {
  input = toBufferString(input);

  if (typeof input === 'string') {
    return babel.transform(input, {
      sourceMap: true,
      presets: ['es2015', 'stage-2'],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-object-rest-spread',
        'transform-async-functions',
        'transform-decorators',
      ],
    });
  }
  return input;
};

const catchError = (callback, fallback) => (error, ...args) => {
  if (error) {
    if (typeof error === 'object') {
      error = JSON.stringify(error);
    }
    return ensureRunFunc(fallback, error)
      || console.log(color.red(error));
  }
  return ensureRunFunc(callback, ...args);
};

const getWebpackCssConfig = (
  mode = CODE.DEV,
  entry = {},
) => ({
  mode,
  entry,
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          safe: true,
          discardComments: {
            removeAll: true,
          }
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `..${DEST}[name]`,
    }),
    new CleanWebpackPlugin([`.${DEST}`], {
      root: path.join(__dirname, '..'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.wxss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              import: false,
            },
          },
          './webpack/combine-loader.js',
        ],
      },
    ],
  },
});

const replaceSlash = (str = '') => str.replace(/(\\)\1*/g, '/');

module.exports = {
  CODE,
  DEST,
  lambda,
  catchError,
  babelTraverse: babelTraverse.default,
  babelTransform,
  babelGenerator: generator.default,
  getWebpackCssConfig,
  ensureDir,
  searchFiles,
  compressFile,
  removeComment,
  removeEmptyLine,
  ensureRunFunc,
  replaceSlash,
  readS,
  copy,
  statS: statSync,
  write,
  keys,
};
