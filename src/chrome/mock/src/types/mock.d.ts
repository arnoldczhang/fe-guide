export type Type = 'object'
  |'array'
  |'null'
  |'string'
  |'number'
  |'boolean'
  | 'bigint'
  | 'symbol'
  | 'undefined'
  | 'function';

export interface TreeData {
  id: string;
  label: string | null;
  value: any;
  type: Type;
  length?: number;
  mock?: string | Record<string, any>;
  children?: TreeData[];
}

export interface Tag {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  status: boolean;
  data: TreeData[];
}

export interface MockItem {
  id: string;
  name: string;
  nameCn: string;
  status: boolean;
  delay: boolean | number;
  tags: Tag[];
}