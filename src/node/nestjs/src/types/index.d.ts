export enum Code {
  SUCCESS = 0,
  FAIL = 1,
}

export enum StateCode {
  STATIC = 0,
  WAIT = 1,
  DISPATCH = 2,
}

export type State = {
  code: Code.SUCCESS | Code.FAIL;
  data?: any;
  message?: string;
};

export type ScriptState =
  | StateCode.STATIC
  | StateCode.DISPATCH
  | StateCode.WAIT;
