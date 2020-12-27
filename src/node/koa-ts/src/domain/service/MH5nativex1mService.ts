import AbstractService from './AbstractService';
import MH5nativex1m from '../aggregate/MH5nativex1m';
import SmartSql from '../../utils/SmartSql';
import { NOT_EQ_TAG } from '../../utils/SmartSql/const';

export default class MH5nativex1mService extends AbstractService {
  public queryApiCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MH5nativex1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getTotal().countMerge().toUInt32().rename(
          smartSql.count,
        ),
      ],
      where,
      groupby,
    });
  }

  public queryApiErrorCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    return this.queryApiCount({
      select,
      where: {
        ...where,
        ncState: [NOT_EQ_TAG, 'success'],
      },
      groupby,
    });
  }

  public queryAvgTime(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MH5nativex1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getAvgTotalTime().avgMerge().rename(
          smartSql.avgTime,
        ),
      ],
      where: {
        ...where,
      },
      groupby,
    });
  }

  public querySuccessAvgTime(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MH5nativex1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getAvgTotalTime().avgMerge().rename(
          smartSql.avgTime,
        ),
      ],
      where: {
        ...where,
        ncState: 'success',
      },
      groupby,
    });
  }

  public queryApiInfoList({
    where = {},
    select = [],
    orderby = [],
    offset = 0,
    limit = 10,
  }: SqlCommonParam): string {
    const table = new MH5nativex1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getNcMethod(),
        table.getTotal().countMerge().toUInt32().rename(
          smartSql.count,
        ),
        table.getAvgTotalTime().avgMerge().rename(
          smartSql.avgTime,
        ),
      ],
      where,
      offset,
      limit,
      groupby: [
        table.getNcMethod(),
      ],
      orderby: orderby.length ? orderby : [['count', 'desc']],
    });
  }

  public querySizeByNcMethod(
    { where = {}, select = [] }: SqlCommonParam,
  ): string {
    const table = new MH5nativex1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getNcMethod().uniq().toUInt32().rename(
          smartSql.size,
        ),
      ],
      where,
      groupby: [],
    });
  }
}
