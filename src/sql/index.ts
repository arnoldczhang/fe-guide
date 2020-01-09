/**
 * SmartSql
 * 语义化 sql 语句，比如：
 * const q = new SmartSql('queryTable');
    const sql = q.select(
      q.eventTimestamp.rename(q.time),
      q.tcpTime.as(q.TTTtime),
      q['1'].count().rename(q.all),
      q.type.avg().toUInt32(),
      q.whiteScreen
    ).where(
      q.timestamp.gte(q.beginDate.divide(1000).toUnixTimestamp()),
      q.timestamp.lte(q.endDate)
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
 */

import AbstractSql from './AbstractSql';

const isStr = (input: any): boolean => typeof input === 'string';
const createCalcObject = (key: BaseType): ICalcCollection => ({
  asc(): ICalcCollection {
    return this.splitArray(['asc'], ' ');
  },
  desc(): ICalcCollection {
    return this.splitArray(['desc'], ' ');
  },
  max(): ICalcCollection {
    return this.wrap('max');
  },
  min(): ICalcCollection {
    return this.wrap('min');
  },
  avg(): ICalcCollection {
    return this.wrap('avg');
  },
  count(): ICalcCollection {
    return this.wrap('count');
  },
  toUInt32(): ICalcCollection {
    return this.wrap('toUInt32');
  },
  interval(interval: BaseType): ICalcCollection {
    return this.splitArray([
      `${/^interval/.test(interval as string) ? '' : 'interval'} ${interval}`
    ]);
  },
  toStartOfInterval(): ICalcCollection {
    return this.wrap('toStartOfInterval');
  },
  toDateTime(): ICalcCollection {
    return this.wrap('toDateTime');
  },
  toUnixTimestamp(): ICalcCollection {
    return this.wrap('toUnixTimestamp');
  },
  toString(): string {
    return String(key);
  },
  rename(name: BaseType): string {
    return `${key} ${name}`;
  },
  as(name: BaseType): string {
    return `${key} as ${name}`;
  },
  in(value: BaseType[]): ICalcCollection {
    return this.wrap('in', ...value);
  },
  eq(value: BaseType): ICalcCollection {
    return this.operate(value, '=');
  },
  gt(value: BaseType): ICalcCollection {
    return this.operate(value, '>');
  },
  gte(value: BaseType): ICalcCollection {
    return this.operate(value, '>=');
  },
  lt(value: BaseType): ICalcCollection {
    return this.operate(value, '<');
  },
  lte(value: BaseType): ICalcCollection {
    return this.operate(value, '<=');
  },
  divide(value: BaseType): ICalcCollection {
    return this.operate(value, '/');
  },
  multiply(value: BaseType): ICalcCollection {
    return this.operate(value, '*');
  },
  add(value: BaseType): ICalcCollection {
    return this.operate(value, '+');
  },
  minus(value: BaseType): ICalcCollection {
    return this.operate(value, '-');
  },
  and(value: BaseType): ICalcCollection {
    return createCalcObject(`${key}\n        and ${value}`);
  },
  splitArray(array: BaseType[], splitter = ', '): ICalcCollection {
    return createCalcObject([key].concat(array).join(splitter));
  },
  wrap(type: BaseType | FunctionSymbol, ...ch: BaseType[]): ICalcCollection {
    if (ch.length) {
      return createCalcObject(`${key} ${type}(${ch.map((val: BaseType) => (
        typeof val === 'number' ? val : `'${val}'`
      ))})`);
    }
    return createCalcObject(`${type}(${key})`);
  },
  operate(value: BaseType, type: CompareSymbol | CalcSymbol): ICalcCollection {
    return createCalcObject(`${key} ${type} ${isStr(value) ? `'${value}'` : value}`);
  },
});

export default class SmartSql extends AbstractSql {
  constructor(protected table: string) {
    super(table);
    return new Proxy(this, {
      get(target, key: Key<SmartSql>): any {
        if (key in target) {
          return target[key];
        }
        return createCalcObject(key);
      }
    });
  }

  static quickStart(name = 'quick'): SmartSql {
    return new SmartSql(name);
  }

  static generateSql(sqlOption: IGenerateSql): string {
    const {
      table,
      select = [],
      where = [],
      groupby = [],
      orderby = [],
      limit,
      offset,
    } = sqlOption;
    const q = new SmartSql(table as string);
    let result = q.select(
      ...select
    ).where(
      ...where
    ).groupBy(
      ...groupby
    ).orderBy(
      ...orderby
    );

    if (limit && limit.length) {
      const [start, ...rest] = limit;
      result = result.limit(
        start,
        ...rest
      );
    }

    if (offset) {
      result = result.offset(offset);
    }
    return result.end();
  }
}
