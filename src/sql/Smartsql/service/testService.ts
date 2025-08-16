import MTable1 from '../domain/aggregate/MTable1';
import AbstractService from './AbstractService';

export default class TestService extends AbstractService{
  public queryMTable1({
    where,
  }: {
    where: ICO;
  }): string {
    const table = new MTable1();
    return this.commonQuery(table, {
      select: [table.getColumn2().rename('xxoo')],
      where: {
        ...where,
        column1: 'column1',
      }
    });
  }
}