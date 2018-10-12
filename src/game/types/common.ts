export interface StateInterface<S = any, SS = S> {
  app: S,
  starter: S,
};

export interface ErrorInfo {
  componentStack: string;
};

export interface Cach {
  readonly KEY: string,
  readonly get: Function,
  readonly getKey: Function,
  readonly set: Function,
  readonly clear: Function,
};

export interface ErrorState {
  hasError?: boolean;
};

export interface ErrorProps {
  children: React.ReactNode;
  className?: string;
};

export type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

export type Partial<T> = {
    [P in keyof T]?: T[P];
};

export type CF = () => void;

export type CO = {
  [key: string]: any;
};

export interface BaseAttr {
  strength: number;
  agile: number;
  physique: number;
  inner: number;
  speed: number;
  charm: number;
  understanding: number;
};

export interface MartialAttr {
  sword: number[];
  blade: number[];
  fist: number[];
  pike: number[];
  internal: number[];
};

export interface OtherAttr {
  doctor: number[];
  carpenter: number[];
  blacksmith: number[];
  tao: number[];
  woven: number[];
  craft: number[];
  identification: number[];
};

export interface CharacterAttr {
  name?: string;
  age?: number;
  remain?: number[];
  baseAttribute?: BaseAttr;
  martialAttribute?: MartialAttr;
  otherAttribute?: OtherAttr;
}
