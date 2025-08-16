import AbstractService from './AbstractService';
import MSdkinit1m from '../aggregate/MSdkinit1m';
import SmartSql from '../../utils/SmartSql';

export default class MSdkinit1mService extends AbstractService {
  public queryUV(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MSdkinit1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getUvCount().uniqMerge().toUInt32().rename(
          smartSql.uv,
        ),
      ],
      where,
      groupby,
    });
  }
}
