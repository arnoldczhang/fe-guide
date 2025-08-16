type HookNameType = 'beforeParamReceive'
  | 'ParamReceived'
  | 'beforeAssemble'
  | 'assembled'
  | 'assembleFailed'
  | 'beforeEachAssemble'
  | 'eachAssembled'
  | 'eachAssembleFailed'
  | 'compiled';

type PipeLineState = 'init'
  | 'param'
  | 'assemble'
  | 'sync'
  | 'async'
  | 'fail'
  | 'compile';

type Hook = {
  [P in HookNameType]: Function[];
};

type PipeLineStateMap = {
  [P in PipeLineState]: number;
};

type PipeLineCompiler = {
  [key: string]: any;
  compile?: Function;
};

type HookName = {
  [P in HookNameType]: P;
};

type CommonReturnResolver = {
  callback?: Function;
  fallback?: Function;
}
