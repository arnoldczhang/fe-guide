import { ModuleInfoKey } from '@/types';
import * as postcssLess from 'postcss-less';

export const babelConfig = {
  presets: [
    ['@babel/env', {
      modules: 'commonjs',
    }],
    ['@babel/preset-typescript', {
      allExtensions: true,
      isTSX: true,
    }],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
    }],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { loose : true }],
    '@babel/plugin-proposal-json-strings',
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-logical-assignment-operators',
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-function-bind',
  ],
};

export const defaultPostcssConfig = {
  from: undefined,
  syntax: postcssLess,
};

export const CSS_AT_RULE = [
  /^\s*@([\-\w]+)?keyframes\s*$/,
  '@charset',
  '@font-face',
  '@media',
  '@import',
  '@viewport',
  '@supports',
];

export const vueRe = /.+\.vue$/;

export const jsRe = /\.(t|j)sx?$/;

export const lessRe = /\.(c|le|sc|sa)ss$/;
// 默认节点树上保留的key，初心是希望过滤掉无关js，但是有需要保留入口文件key
export const includeRe = /(?:.+\.vue|\/router\/index\.(t|j)s|main\.tsx?)$/;
// 判断冗余时，默认剔除的正则
export const excludeRes = [
  /(?:\/router\/index\.(t|j)s|main\.tsx?)$/,
  /App\.vue$/,
];

export const defaultModuleInfoKey: ModuleInfoKey[] = [
  'name',
  // 组件路径
  'path',
  // 作者
  'author',
  // 分类
  'category',
  // 描述
  'description',
  // 预览图
  'avatar',
];
