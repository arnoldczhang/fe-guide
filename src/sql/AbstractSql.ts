import AnySql from './AnySql';

const identity = (v: any): any => v;

/**
 * AbstractSql
 */
export default abstract class AbstractSql extends AnySql {
  protected selectArray: Array<ICalcCollection|string> = [];

  protected whereArray: Array<ICalcCollection|string> = [];

  protected orderByArray: Array<ICalcCollection|string> = [];

  protected groupByArray: Array<ICalcCollection|string> = [];

  protected limitArray: number[] = [];

  protected offsetCount: number = 0;

  constructor(protected table: string) {
    super();
    this.table = table;
  }

  public select(...args: Array<ICalcCollection|string>): AbstractSql {
    this.selectArray = args.filter(identity);
    return this;
  }

  public where(...args: Array<ICalcCollection|string>): AbstractSql {
    this.whereArray = args.filter(identity);
    return this;
  }

  public orderBy(...args: Array<ICalcCollection|string>): AbstractSql {
    this.orderByArray = args.filter(identity);
    return this;
  }

  public groupBy(...args: Array<ICalcCollection|string>): AbstractSql {
    this.groupByArray = args.filter(identity);
    return this;
  }

  public limit(start: number, end?: number): AbstractSql {
    this.limitArray = end ? [start, end] : [start];
    return this;
  }

  public offset(size: number): AbstractSql {
    this.offsetCount = size;
    return this;
  }

  public end(): string {
    return `select\n    ${this.selectArray.join(',\n    ')}\nfrom\n    ${this.table}\n${
      this.whereArray.length
        ? `where\n    ${this.whereArray.join('\n        and ')}` : ''
    }${
      this.groupByArray.length
        ? `\ngroup by\n    ${this.groupByArray.join(',\n    ')}` : ''
    }${
      this.orderByArray.length
        ? `\norder by\n    ${this.orderByArray.join(',\n    ')}` : ''
    }${
      this.limitArray.length
        ? `\nlimit ${this.limitArray.join()}` : ''
    }${
      this.offsetCount
        ? `\noffset ${this.offsetCount}` : ''
    }
    `;
  }

  public insert(...args: Array<ICalcCollection|string>): string {
    const result = args.reduce((res: ICO, pre: ICalcCollection|string) => {
      const [key, value] = pre.toString().split(/\s+=\s+/);
      if (value === undefined || value === null) {
        return res;
      }
      res[key] = typeof value === 'string' ? `${value || '\'\''}` : value;
      return res;
    }, {});
    return `Insert into ${this.table} (${Object.keys(result)}) values(${Object.values(result)})`;
  }
}
