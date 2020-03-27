import AbstractTable from './AbstractTable';

const tableName = 'm_table_1';

export default class MTable1 extends AbstractTable {
  private column2: string = 'column2';

  public get(key: string|number): ICalcCollection {
    return this.query[key];
  }

  public getColumn2(): ICalcCollection {
    return this.query[this.column2];
  }

  constructor() {
    super(tableName);
  }
}
