type BaseType = string | number | null;
type CompareSymbol = '=' | '>' | '<' | '<>' | '<=' | '>=';
type CalcSymbol = '+' | '-' | '*' | '/';
type FunctionSymbol = 'avg' | 'max' | 'min' | 'quantile';
type CalcMethods = (input: BaseType) => ICalcCollection;
type joinMethods = (array: BaseType[], extra?: any) => ICalcCollection;
type FuncMethods = () => ICalcCollection;
type Key<T> = keyof T;

interface ICO<T = any> {
  [key: string]: T;
}

interface IGenerateSql {
  table?: string;
  select: string[],
  where: string[],
  interval?: string;
  groupby: string[];
  orderby?: string[];
}

interface ICalcCollection {
  eq: CalcMethods;
  gt: CalcMethods;
  gte: CalcMethods;
  lt: CalcMethods;
  lte: CalcMethods;
  and: CalcMethods;
  divide: CalcMethods;
  multiply: CalcMethods;
  add: CalcMethods;
  minus: CalcMethods;
  max: FuncMethods;
  min: FuncMethods;
  avg: FuncMethods;
  desc: FuncMethods;
  asc: FuncMethods;
  count: FuncMethods;
  toUInt32: FuncMethods;
  interval: CalcMethods;
  toUnixTimestamp: FuncMethods;
  toDateTime: FuncMethods;
  toStartOfInterval: FuncMethods;
  splitArray: joinMethods;
  wrap: CalcMethods;
  toString: () => string;
  rename: (input: BaseType) => string;
  as: (input: BaseType) => string;
  operate: (input: BaseType, type: CompareSymbol | CalcSymbol) => ICalcCollection;
}
