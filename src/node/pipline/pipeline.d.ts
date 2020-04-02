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
  | 'doing'
  | 'sync'
  | 'async'
  | 'failed'
  | 'compiled'
  | 'uninstalled';

type Hook = {
  [P in HookNameType]: Function[];
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
