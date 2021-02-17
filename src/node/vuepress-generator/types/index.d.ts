import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export interface VueResult extends ModuleInfo {
  // js中的import
  import: Map<any, any>;
  // 组件->import路径
  component: Map<string, string>;
  // vue中的data
  data: Map<any, any>;
  // vue中的prop
  prop: Map<any, any>;
  // 组件->模板
  template: Map<any, Set<string>>;
  // 模板所在行信息
  location: Map<string, number[]>;
  // 美化后的路径
  short?: string;
  // js外链绝对路径
  src?: string;
}

export interface CompResult {
  path: string;
  gitlabPath?: string;
  originPath: string;
  relativePath: string;
  location: Map<string, number[]>;
  usage: Record<string, Set<string>>;
}

export interface ReplaceLessOption {
  css: RegExp[];
  vue: RegExp[];
  skip: RegExp[];
  replacements: Replacer[];
}

export interface ErrorOption {
  fnName?: string;
  quiet?: boolean;
}

export interface ReadmeInput {
  // 组件标题
  title: string;
  // 我在哪
  path: string[];
  // vuepress特定组件名
  name: string;
  // 本次编译的组件信息
  compInfo: VueResult;
  // 组件的预配置文件
  localConfig: ModuleInfo;
  // 谁在用
  parent: Set<CompResult>;
}

export interface Tree {
  children: Tree[];
  name: string;
}

export interface PathInfo {
  // 根src路径
  root: string;
  // vupress的components路径
  vuepress: string;
  // node_modules路径
  node: string;
  // 当前文件路径
  current: string;
  // 全局组件
  global: Map<string, string>;
}

export type Func<T = any> = (...args: T[]) => any;

type Scope = RegExp | string;
export interface Replacer {
  // 替换目标，若是数组，第一个元素可以限定范围
  target: string | RegExp | [Scope, string];
  replacer: string;
}

export interface ExportExtractOption {
  content?: string;
  properties?: NodePath<t.Node>[];
}

export type TreeNode = Record<string, string[]>;

/**
 * 外部配置
 */
export interface Reg {
  // 通用.vue
  vue?: RegExp;
  // 通用.js/.ts/.jsx/.tsx
  js?: RegExp;
  // 通用.less/.css/.sass
  less?: RegExp;
  // 通用包含检测
  include?: RegExp | RegExp[];
  // 通用排除检测
  exclude?: RegExp[];
}

export interface Entry {
  // 通用资源目录
  src: string;
  // node_modules
  node: string;
  // router文件
  router?: string;
  // gitlab地址
  gitlab?: string;
  // 外部配置文件
  configFile?: string;
  // 替换内容
  replacements?: Replacer[];
}

export interface Output {
  // 通用输出目录
  dir?: string;
  // 通用输出文件路径
  fileName?: string;
  // 输出的压缩图片路径
  compress?: string;
  // 第二通用输出目录
  subDir?: string;
}

export interface Plugin {
  install: (...args: any[]) => any;
}

export interface FridayConfig {
  // 输入
  entry: Entry;
  // 输出
  output: Output;
  // 通用正则
  regExp?: Reg;
  // 检测时跳过的文件正则
  skip?: RegExp[];
  // 插件
  plugin?: Plugin[];
  // 美化路径列表
  prettyList?: string[][];
  // 清空路径列表
  clearList?: string[];
}
export interface ModuleInfo {
  // 组件名
  name?: string;
  // 组件中文名
  nameCh?: string;
  // 组件路径
  path?: string;
  // 作者
  author?: string[];
  // 分类
  category?: string | string[];
  // 描述
  description?: string;
  // 预览图
  avatar?: string;
  // 替换组件的default值
  default?: Record<string, any>;
  // 版本
  version?: string;
  // 关键信息
  keyword?: string;
}

export type ModuleInfoKey = keyof ModuleInfo;
