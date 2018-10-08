export interface stateInterface<S = any, SS = S> {
  app: S,
}

export interface Cach {
  readonly KEY: string,
  readonly get: Function,
  readonly set: Function,
}

export type ErrorState = Partial<{
  hasError?: boolean;
}>;

export type ErrorProps = Partial<{
  children: React.ReactNode;
}>;

export interface ErrorInfo {
  componentStack: string;
}