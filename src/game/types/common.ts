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
  readonly set: Function,
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
