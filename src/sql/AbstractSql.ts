import AnySql from './AnySql';

/**
 * AbstractSql
 */
export default abstract class AbstractSql extends AnySql {
  protected selectArray: string[] = [];

  protected whereArray: string[] = [];

  protected orderByArray: string[] = [];

  protected groupByArray: string[] = [];

  protected limitArray: number[] = [];

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
    }
    `;
  }
}
