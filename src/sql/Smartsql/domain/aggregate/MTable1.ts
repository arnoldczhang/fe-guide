import AbstractTable from './AbstractTable';

const tableName = 'm_table_1';

export default class MTable1 extends AbstractTable {
  private column2: string = 'column2';

  public getColumn2(): ICalcCollection {
    return this.get(this.column2);
  }

  constructor() {
    super(tableName);
  }
}
