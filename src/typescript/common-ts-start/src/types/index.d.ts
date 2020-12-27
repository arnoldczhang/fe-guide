export interface VueResult {
  import: Map<any, any>;
  component: Map<any, any>;
  data: Map<any, any>;
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