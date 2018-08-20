/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');
const color = require('chalk');
const babel = require("babel-core");
const generator = require('babel-generator');
const babelTraverse = require("babel-traverse");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const uglifyJS = require('uglify-js');
const readline = require('readline');
const ora = require('ora');
const signale = require('signale');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');
const { Signale } = signale;

console.error = signale.fatal;
console.warn = signale.warn;

const DIR = '__dir';
const FUNC = v => v;
const CODE = {
  DEV: 'development',
  PROD: 'production',
};
const SRC = '/src';
const DEST = process.env.NODE_ENV === CODE.PROD ? '/release' : '/dist';

const isProd = () => (process.env.NODE_ENV === CODE.PROD);
const isDev = () => (process.env.NODE_ENV === CODE.DEV);
const replaceSlash = (str = '') => str.replace(/(\\)\1*/g, '/');
const logStart = (title = '') => (console.log(`Starting '${color.cyan(title)}'...`));
const fixWavy = (input = '') => (input.slice(Number(/^~/.test(input))));
const getSuffix = (input = '') => ((/\.([^\.]+)$/.exec(input) || [])[1] || '');

const logEnd = (title = '', time = '??') => {
  time = time === '??' ? time : (Date.now() - time);
  console.log(`Finished '${color.cyan(title)}' after ${color.magenta(time > 1000 ? (time / 1000).toFixed(2) : time)} ${time > 1000 ? 's' : 'ms'}...`);
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
    console.error('err', err, dir);
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
  if (!(DIR in result)) {
    Object.defineProperty(result, DIR, {
      value: {},
      enumerable: false,
    });
  }

  if (src && matchRe instanceof RegExp) {
    fs.readdirSync(src).forEach((file) => {
      if (dirRe.test(file) || matchRe.test(file)) {
        const fullpath = path.join(src, file);
        if (fs.statSync(fullpath).isDirectory()) {
          searchFiles(matchRe, fullpath, result, `${parent}/${file}`);
        } else if (matchRe.test(fullpath)) {
          result[`${parent}/${file}`] = fullpath;
          (result[DIR][parent] || (result[DIR][parent] = [])).push(fullpath);
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

const defaultSteps = [removeComment, removeEmptyLine];

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
        ['transform-inline-environment-variables', {
          include: [
            'NODE_ENV',
          ],
        }],
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-object-rest-spread',
        'transform-async-functions',
        'transform-decorators',
        [
          "transform-runtime",
          {
            "helpers": false,
            "polyfill": false,
            "regenerator": true,
          }
        ],
      ],
    });
  }
  return input;
};

const catchError = (
  callback,
  fallback,
  options = {},
) => (error, ...args) => {
  const {
    force = false,
  } = options;
  if (error) {
    if (typeof error === 'object') {
      error = JSON.stringify(error);
    }
    ensureRunFunc(fallback, error) || console.error(color.red(error));
    if (force) {
      process.exit(1);
    }
    return;
  }
  return ensureRunFunc(callback, ...args);
};

const getWebpackCssConfig = (
  entry = {},
  options = {},
) => ({
  mode: process.env.NODE_ENV,
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
      filename: `..${options.destName || DEST}[name]`,
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
          {
            loader: './webpack/wxss-loader.js',
            options: Object.assign({}, options, {
              type: 'post',
            }),
          },
          {
            loader: 'less-loader',
          },
          {
            loader: './webpack/wxss-loader.js',
            options,
          },
        ],
      },
    ],
  },
});

const uglify = (input = '', callback) => {
  const { error, code } = uglifyJS.minify(input, {
    output: {},
    compress: true,
    mangle: {
      toplevel: true,
    },
    toplevel: true,
  });
  if (error) {
    return console.error(color.red(uglifyRes.error));
  }
  return ensureRunFunc(callback, code) || code;
};

const minImage = async (
  src,
  dest,
  {
    quality = '65-80',
    hooks = {},
  } = {},
) => {
  src = /(\.[\w]+)$/.test(src) ? src : `${src}/*.{jpg,jpeg,png,gif,svg}`;
  try {
    ensureRunFunc(hooks.start);
    await imagemin([src], `${dest}`, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({ quality }),
        imageminSvgo({ plugins: [{removeViewBox: false}] }),
        imageminGifsicle(),
      ],
    });
    ensureRunFunc(hooks.end);
  } catch (err) {
    console.warn(color.yellow(err));
  }
};

const Cach = (() => {
  const _cach = {};
  return {
    getCach() {
      return _cach;
    },
    init(id, value) {
      this.getCach()[id] = value || {};
    },
    set(id, key, value) {
      if (key) {
        this.getCach()[id]  = this.getCach()[id] || {};
        this.getCach()[id][key] = value;
      }
    },
    get(id, key) {
      if (key) {
        return this.getCach()[id][key];
      }
      return this.getCach()[id];
    },
  };
})();

class Spinner {
  constructor(id) {
    this.id = id;
    this.instance = ora(id).start();
  }

  say(input = '') {
    this.instance.text = input;
    this.instance.render();
  }

  end() {
    this.instance.stop();
  }
}

const clearConsole = async (title) => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    if (title) {
      console.log(title);
    }
  }
};

const getPathBack = (replacePath = '') => {
  const result = [];
  replacePath.replace(/[\/]/g, () => (result.push('../')));
  return result.join('');
};

const Logger = (
  length = 1,
  {
    scope = '^_^',
    index = 1,
  } = {},
) => {
  const instance = new Signale({ interactive: true, scope, });
  return {
    await(word = '') {
      instance.pending(`[%d/${length}] - ${word}`, index);
    },

    success(word = '') {
      instance.success(`[%d/${length}] - ${word}`, index++);
    },
  };
};

module.exports = {
  CONST: {
    SRC,
    DEST,
    DIR,
  },
  isProd,
  isDev,
  logStart,
  logEnd,
  Spinner,
  Cach,
  Logger,
  lambda,
  uglify,
  catchError,
  clearConsole,
  minImage,
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
  keys,
  getSuffix,
  fixWavy,
  getPathBack,
};
