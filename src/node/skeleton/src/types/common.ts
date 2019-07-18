import { PATH } from '../config';

export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export interface IProxy<T> {
    get(): T;
    set(value: T): void;
}

export type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

export type Record<K extends string, T> = {
    [P in K]: T;
};

export type Diff<T extends string, U extends string> =
    ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];

export type Overlap<T extends string, U extends string> = Diff<T, Diff<T, U>>;

export type Purify<T extends string> = { [P in T]: T; }[T];

export type NonNullable<T> = T & {};

export type CF = () => any;

export interface ICO<T = any> {
  [key: string]: T;
}

export interface IAst {
  node?: string;
  text?: string;
  tag?: string;
  attr?: ICO;
  sibling?: IAst | void;
  child?: IAst[];
}

export type ICach = ICO & Partial<{
  [PATH]: ICO;
}>;
