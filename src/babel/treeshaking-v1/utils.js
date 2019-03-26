const path = require('path');
const { transformSync } = require('@babel/core');
const uglifyJS = require('uglify-js');

exports.projectDir = path.join(__dirname, '../../waimai_wxapp/src');
exports.nodeDir = path.join(__dirname, '../../waimai_wxapp/node_modules');
exports.IMPORT = './test1/import.json';
exports.OUTPORT = './test1/export.json';
exports.DEFAULT = 'default';
exports.MAX = 300;

const include = (arrayLike = [], item) => {
  return arrayLike instanceof Set || arrayLike instanceof WeakSet
    ? arrayLike.has(item)
    : arrayLike.indexOf(item) !== -1;
};

exports.say = console.log;
exports.strify = (target = []) => target.toString();
exports.include = include;
exports.exclude = (...args) => !include(...args);

exports.transSetObjectToArray = (object = {}) =>
  Object.keys(object).forEach(key =>
    object[key] = Array.from(object[key])
  );

const getNodeProperty = (target = {}, prop = 'name') => {
  let result = '';
  const node = target && target.node;
  if (node && node[prop]) {
    result = node[prop];
  }
  return result;
};

exports.getNodeProperty = getNodeProperty;

exports.getNodeName = getNodeProperty;

exports.getNodeValue = (target = {}) => getNodeProperty(target, 'value');

exports.transformSync = (input, filename) => (
  transformSync(input, {
    filename,
    ast: true,
    code: false,
    sourceMap: true,
    babelrc: false,
    configFile: false,
    presets: [
      ["@babel/env", {
        "loose": false,
        // "modules": false
      }],
    ],
    plugins: [
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-transform-runtime",
      "@babel/plugin-proposal-class-properties",
      "transform-regenerator",
      "@babel/plugin-proposal-function-bind",
      "@babel/plugin-proposal-export-default-from",
      // "minify-dead-code-elimination"
    ]
  })
);

exports.uglify = code =>
  uglifyJS.minify(code, {
    output: {},
    compress: {
      dead_code: true,
      global_defs: {
        ENV: 'tt',
      }
    },
    mangle: {
      toplevel: false,
    },
  });

exports.searchHook = {
  
};

exports.shakeHook = {

};
