type BaseType = string | number | ICalcCollection |null;
type CompareSymbol = '=' | '!=' | '>' | '<' | '<>' | '<=' | '>=';
type CalcSymbol = '+' | '-' | '*' | '/' | '%';
type FunctionSymbol = 'avg' | 'max' | 'min' | 'quantile';
type CalcMethods = (input: BaseType) => ICalcCollection;
type joinMethods = (array: BaseType[], ...args: any[]) => ICalcCollection;
type FuncMethods = () => ICalcCollection;
type Key<T> = keyof T;

interface ICO<T = any> {
  [key: string]: T;
}

interface IGenerateSql {
  table?: string;
  select: Array<ICalcCollection|string>,
  where: Array<ICalcCollection|string>,
  interval?: string;
  groupby?: Array<ICalcCollection|string>;
  orderby?: Array<ICalcCollection|string>;
  limit?: number[] | null;
  offset?: number;
}

interface ICalcCollection {
  eq: CalcMethods;
  notEq: CalcMethods;
  gt: CalcMethods;
  gte: CalcMethods;
  lt: CalcMethods;
  lte: CalcMethods;
  and: CalcMethods;
  or: CalcMethods;
  remind: CalcMethods;
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
  countIf: FuncMethods;
  avgIf: CalcMethods;
  nullIf: CalcMethods;
  toUInt32: FuncMethods;
  countMerge: FuncMethods;
  uniqMerge: FuncMethods;
  anyMerge: FuncMethods;
  sumMerge: FuncMethods;
  avgMerge: FuncMethods;
  quantilesTimingMerge: CalcMethods;
  interval: CalcMethods;
  toUnixTimestamp: FuncMethods;
  toDateTime: FuncMethods;
  toStartOfInterval: FuncMethods;
  splitArray: joinMethods;
  wrap: (input: BaseType, ...args: any[]) => ICalcCollection;
  appendWrap: (input: BaseType, ...args: any[]) => ICalcCollection;
  toString: () => string;
  rename: (input: BaseType) => string;
  as: (input: BaseType) => string;
  in: joinMethods;
  notIn: joinMethods;
  uniq: FuncMethods;
  not: FuncMethods;
  length: FuncMethods;
  any: FuncMethods;
  group: FuncMethods;
  operate: (input: BaseType, type: CompareSymbol | CalcSymbol) => ICalcCollection;
}
