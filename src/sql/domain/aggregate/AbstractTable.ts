import SmartSql from '../../index';
import AbstractSql from '../../AbstractSql';

export default abstract class AbstractTable extends AbstractSql {
  protected query: SmartSql = SmartSql.quickStart();

  private name: string = '';

  private column1: string = 'column1';

  private time: string = 'time';

  public getName(): string {
    return this.name;
  }

  public getColumn1(): ICalcCollection {
    return this.query[this.column1];
  }


  public getTime(): ICalcCollection {
    return this.query[this.time];
  }

  constructor(tableName: string) {
    super(tableName);
    this.name = tableName;
  }
}
