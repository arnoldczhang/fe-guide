import SmartSql from '../../index';
import AbstractSql from '../../AbstractSql';

const env: string = require('../../../env.js');

export default abstract class AbstractTable extends AbstractSql {
  static getName(name: string): string {
    return `${name}${env === 'pro' ? '_all' : ''}`;
  }

  protected query: SmartSql = SmartSql.quickStart();

  private name: string = '';

  private column1: string = 'column1';

  public get(key: string|number): ICalcCollection {
    if (!(key in this)) {
      throw new Error(`字段: ${key} 不在当前 table 中`);
    }
    return this.query[key];
  }

  public getName(): string {
    return AbstractTable.getName(this.name);
  }

  public getColumn1(): ICalcCollection {
    return this.get(this.column1);
  }

  constructor(tableName: string) {
    super(AbstractTable.getName(tableName));
    this.name = tableName;
  }
}
