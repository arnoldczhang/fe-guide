const path = require('path');

const TYPE = {
  alipay: 'alipay',
  wx: 'wx',
};

const babelConfig = {
  presets: [
    ['@babel/env', {
      modules: 'commonjs',
    }],
    "@babel/react",
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
    }],
  ],
};

const DEFAULT_TEMP_PATH = path.resolve(__dirname, './.preParser');

const DEFAULT_WEBPACK_OUT_PATH = path.resolve(__dirname, './.webpackDist');

const MAIN_FILE_PATH = 'main.split.js';

exports.TYPE = TYPE;

exports.babelConfig = babelConfig;

exports.DEFAULT_TEMP_PATH = DEFAULT_TEMP_PATH;

exports.MAIN_FILE_PATH = MAIN_FILE_PATH;

exports.DEFAULT_WEBPACK_OUT_PATH = DEFAULT_WEBPACK_OUT_PATH;