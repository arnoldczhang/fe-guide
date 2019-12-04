/**
 * SmartSql
 * 
 * 语义化 sql 语句，比如：
 * 
 * const q = new SmartSql('queryTable');
    const sql = q.select(
      q.eventTimestamp.rename(q.time),
      q.tcpTime.as(q.TTTtime),
      q['1'].count().rename(q.all),
      q.type.avg().toUInt32(),
      q.whiteScreen
    ).where(
      q.timestamp.gte(q.beginDate.divide(1000).toUnixTimestamp())
        .and(q.timestamp.lte(q.endDate))
    ).orderBy(
      q.weight,
      q.height,
    ).groupBy(
      q.pathHash
    ).limit(2, 3)
    .end();
 *
 * 最终生成的 sql 语句是：
 * 
 * select
        eventTimestamp time,
        tcpTime as TTTtime,
        count(1) all,
        toUInt32(avg(type)),
        whiteScreen
    from
        queryTable
    where
        timestamp >= toUnixTimestamp(beginDate / 1000)
            and timestamp <= endDate
    order by
        weight,
        height
    group by
        pathHash
    limit 2,3
 *    
 */

type BaseType = string | number | null;
type CompareSymbol = '=' | '>' | '<' | '<>' | '<=' | '>=';
type CalcSymbol = '+' | '-' | '*' | '/';
type FunctionSymbol = 'avg' | 'max' | 'min' | 'quantile';
type CalcMethods = (input: BaseType) => ICalcCollection;
type FuncMethods = () => ICalcCollection;
type Key = keyof SmartSql;

interface ICalcCollection {
  eq: CalcMethods;
  gte: CalcMethods;
  lte: CalcMethods;
  and: CalcMethods;
  divide: CalcMethods;
  multiply: CalcMethods;
  add: CalcMethods;
  minus: CalcMethods;
  max: FuncMethods;
  min: FuncMethods;
  avg: FuncMethods;
  count: FuncMethods;
  toUInt32: FuncMethods;
  toUnixTimestamp: FuncMethods;
  wrap: CalcMethods;
  toString: () => string;
  rename: (input: BaseType) => string;
  as: (input: BaseType) => string;
  operate: (input: BaseType, type: CompareSymbol | CalcSymbol) => ICalcCollection;
};

const isStr = (input: any) => typeof input === 'string';
const createCalcObject = (key: BaseType): ICalcCollection => ({
  max() {
    return this.wrap('max');
  },
  min() {
    return this.wrap('min');
  },
  avg() {
    return this.wrap('avg');
  },
  count() {
    return this.wrap('count');
  },
  toUInt32() {
    return this.wrap('toUInt32');
  },
  toUnixTimestamp() {
    return this.wrap('toUnixTimestamp');
  },
  toString() {
    return String(key);
  },
  rename(name: BaseType) {
    return `${key} ${name}`;
  },
  as(name: BaseType) {
    return `${key} as ${name}`;
  },
  eq(value: BaseType) {
    return this.operate(value, '=');
  },
  gte(value: BaseType) {
    return this.operate(value, '>=');
  },
  lte(value: BaseType) {
    return this.operate(value, '<=');
  },
  divide(value: BaseType) {
    return this.operate(value, '/');
  },
  multiply(value: BaseType) {
    return this.operate(value, '*');
  },
  add(value: BaseType) {
    return this.operate(value, '+');
  },
  minus(value: BaseType) {
    return this.operate(value, '-');
  },
  and(value: BaseType) {
    return createCalcObject(`${key}\n        and ${value}`);
  },
  wrap(type: FunctionSymbol) {
    return createCalcObject(`${type}(${key})`);
  },
  operate(value: BaseType, type: CompareSymbol | CalcSymbol) {
    return createCalcObject(`${key} ${type} ${isStr(value) ? `'${value}'` : value}`);
  },
});

abstract class AnySql<T = any> {
  constructor() {}
  [key: string]: T;
}

abstract class AbstractSql extends AnySql {
  protected selectArray: string[];
  protected whereArray: string[];
  protected orderByArray: string[];
  protected groupByArray: string[];
  protected limitArray: number[];

  constructor(protected table: string) {
    super();
    this.table = table;
  }

  public select(...args: string[]): AbstractSql {
    this.selectArray = args;
    return this;
  }

  public where(...args: string[]): AbstractSql {
    this.whereArray = args;
    return this;
  }

  public orderBy(...args: string[]): AbstractSql {
    this.orderByArray = args;
    return this;
  }

  public groupBy(...args: string[]): AbstractSql {
    this.groupByArray = args;
    return this;
  }

  public limit(start: number, end?: number): AbstractSql {
    this.limitArray = end ? [start, end] : [start];
    return this;
  }

  public end(): string {
    return `select\n    ${this.selectArray.join(',\n    ')}\nfrom\n    ${this.table}\n${
        this.whereArray.length ?
        `where\n    ${this.whereArray.join('\n    ')}` : ''
      }${
        this.orderByArray.length ?
        `\norder by\n    ${this.orderByArray.join(',\n    ')}`: ''
      }${
        this.groupByArray.length ?
        `\ngroup by\n    ${this.groupByArray.join(',\n    ')}`: ''
      }${
        this.limitArray.length ?
        `\nlimit ${this.limitArray.join()}`: ''
      }
    `;
  }
}

export default class SmartSql extends AbstractSql {
  constructor(protected table: string) {
    super(table);
    return new Proxy(this, {
      get(target, key: Key) {
        if (key in target) {
          return target[key];
        }
        return createCalcObject(key);
      }
    });
  }
}
