import AbstractService from './AbstractService';
import MPageBaseInfo1m from '../aggregate/MPageBaseInfo1m';
import MHttpRequestBaseInfo1m from '../aggregate/MBaseInfo1m';
import SmartSql from '../../utils/SmartSql';

export default class MPageBaseInfo1mService extends AbstractService {
  adaptQuery(
    table: MHttpRequestBaseInfo1m,
    params: SqlCommonParam,
  ): string {
    const {
      where = {},
    } = params;
    params.where = {
      ...where,
      logType: 'h5Pageload',
      sql: where.sql,
    };
    return this.commonQuery(table, params);
  }

  public queryPV(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MPageBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getPvCount().countMerge().toUInt32().rename(
          smartSql.pvCount,
        ),
      ],
      where,
      groupby,
    });
  }

  public queryPVLogDetail({
    where = {},
    groupby = [],
    select = [],
    offset,
    limit,
  }: SqlCommonParam): string {
    const table = new MHttpRequestBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getAppName().count().toUInt32().rename(
          smartSql.pvCount,
        ),
      ],
      where,
      groupby,
      offset,
      limit,
    });
  }

  public queryUV(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MPageBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getUvCount().uniqMerge().toUInt32().rename(
          smartSql.uvCount,
        ),
      ],
      where,
      groupby,
    });
  }
}
