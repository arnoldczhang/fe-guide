export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

export type Partial<T> = {
  [P in keyof T]?: T[P];
};
export type CF = () => void;

export type CO<T = any> = {
  [key: string]: T;
};

export type BaseState = Partial<{
  title: string;
}>;

export type BaseProps = Partial<{
  children?: React.ReactNode;
  dispatch?: Function | any;
}>;