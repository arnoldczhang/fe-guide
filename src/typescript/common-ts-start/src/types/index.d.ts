import {
  AST,
} from 'vue-eslint-parser';

export interface VueResult {
  import: Map<any, any>;
  component: Map<string, string>;
  data: Map<any, any>;
  prop: Map<any, any>;
  template: Map<any, Set<string>>;
  src?: string,
}

export interface Tree {
  children: Tree[];
  name: string;
}

export interface Reg {
  // 通用.vue
  vue: RegExp;
  // 通用.js/.ts/.jsx/.tsx
  js: RegExp;
  // 通用.less/.css/.sass
  less: RegExp;
  // 通用包含检测
  include: RegExp | RegExp[];
  // 通用排除检测
  exclude: RegExp[];
}

export interface Entry {
  // 查找目录
  src: string;
  // node_modules
  node: string;
  // router文件
  router: string;
}

export interface Output {
  // 输出的冗余文件json
  redundant: string;
  // 输出的图片路径
  img: string;
  // 输出的压缩图片路径
  imgCompress: string;
  // 输出的图片目录（多个时）
  imgDir: string;
}

export interface Plugin {
  install: (...args: any[]) => any;
}

export interface TreeParam {
  // 输入
  entry: Entry;
  // 通用正则
  regExp: Reg;
  // 美化的路径列表
  prettyList: string[][];
  // 输出
  output: Output;
  // 检测冗余时，跳过的文件正则
  skip: RegExp[];
  // 插件
  plugin: Plugin[];
}

export interface PathInfo {
  root: string;
  npm: string;
  current?: string;
}

export type Func<T = any> = (...args: T[]) => any;

export interface StyleReplacer {
  key: string;
  value: string;
  replacer: string;
}

export type TreeNode = Record<string, string[]>;
