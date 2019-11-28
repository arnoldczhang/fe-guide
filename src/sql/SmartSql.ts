/**
 * 
 * const query = new Query(queryTable);
    query.select(
      toUnixTimestamp(interval(query.eventTimestamp, 1)),
      toUInt32(avg(type, 'value')),
      toUInt32(count(1, 'value2'))
    )
    .where(
      query.timestamp.gte(toDateTime(beginDate / 1000))
        .and(query.timestamp.lte(toDateTime(endDate / 1000)))
    )
    .orderBy(
      query.eventTimestamp,
      query.millisecond
    ).end();
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
  max: FuncMethods;
  min: FuncMethods;
  avg: FuncMethods;
  wrap: CalcMethods;
  toString: () => string;
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
  toString() {
    return String(key);
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
  and(value: BaseType) {
    return createCalcObject(`  and ${value}`);
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

  constructor(protected table: string) {
    super();
    this.table = table;
  }

  public select(...args: string[]) {
    this.selectArray = args;
    return this;
  }

  public where(...args: string[]) {
    this.whereArray = args;
    return this;
  }

  public orderBy(...args: string[]) {
    this.orderByArray = args;
    return this;
  }

  public groupBy(...args: string[]) {
    this.groupByArray = args;
    return this;
  }

  public end() {
    return `
      select
        ${this.selectArray.join(',\n')}
      from ${this.table}
      ${
        this.whereArray.length ?
        `where
          ${this.whereArray.join('\n')}` : ''
      }
      ${
        this.orderByArray.length ?
        `order by
          ${this.orderByArray.join()}`: ''
      }
      ${
        this.groupByArray.length ?
        `group by
          ${this.groupByArray.join()}`: ''
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