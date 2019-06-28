export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type CF = () => any;

export interface ICO<T = any> {
  [key: string]: T;
}

export interface IAst {
  node?: string;
  text?: string;
  tag?: string;
  attr?: ICO;
  child?: IAst[];
}
