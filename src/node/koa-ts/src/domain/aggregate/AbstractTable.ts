import SmartSql from '../../utils/SmartSql/index';
import AbstractSql from '../../utils/SmartSql/AbstractSql';

const env: string = require('../../../env.js');

export default abstract class AbstractTable extends AbstractSql {
  static getName(name: string): string {
    return `${name}${env === 'pro' ? '_all' : ''}`;
  }

  protected query: SmartSql = SmartSql.quickStart();

  private name: string = '';

  private appName: string = 'appName';

  private time: string = 'time';

  private eventTimestamp: string = 'eventTimestamp';

  public get(key: string|number): ICalcCollection {
    if (!(key in this)) {
      console.warn(`字段: ${key} 不在当前 table 中`);
    }
    return this.query[key];
  }

  public getName(): string {
    return AbstractTable.getName(this.name);
  }

  public getAppName(): ICalcCollection {
    return this.get(this.appName);
  }

  public getTime(): ICalcCollection {
    return this.get(
      this.name !== 't_log_details' ? this.time : this.eventTimestamp
    );
  }

  constructor(tableName: string) {
    super(AbstractTable.getName(tableName));
    this.name = tableName;
  }
}
