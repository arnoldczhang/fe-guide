import MTable1 from '../domain/aggregate/MTable1';

export default class TestService {
  public queryMTable1({
    where,
  }: {
    where: ICO;
  }): string {
    const {
      column1,
    } = where;
    const table = new MTable1();
    const sql = table.select(
      table.getColumn2().rename('xxoo'),
    ).where(
      table.getColumn1().eq(column1),
    ).end();
    return sql;
  }
}