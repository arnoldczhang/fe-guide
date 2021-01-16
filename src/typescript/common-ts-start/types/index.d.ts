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
