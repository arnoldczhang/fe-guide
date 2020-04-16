import SmartSql from '../../index';
import AbstractSql from '../../AbstractSql';

export default abstract class AbstractTable extends AbstractSql {
  protected query: SmartSql = SmartSql.quickStart();

  private name: string = '';

  private column1: string = 'column1';

  private time: string = 'time';

  public get(key: string|number): ICalcCollection {
    if (!(key in this)) {
      throw new Error(`字段: ${key} 不在当前 table 中`);
    }
    return this.query[key];
  }

  public getName(): ICalcCollection {
    return this.get(this.name);
  }

  public getColumn1(): ICalcCollection {
    return this.get(this.column1);
  }


  public getTime(): ICalcCollection {
    return this.get(this.time);
  }

  constructor(tableName: string) {
    super(tableName);
    this.name = tableName;
  }
}
