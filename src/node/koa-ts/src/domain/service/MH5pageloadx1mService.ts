import AbstractService from './AbstractService';
import MH5pageloadx1m from '../aggregate/MH5pageloadx1m';
import SmartSql from '../../utils/SmartSql';

export default class MH5pageloadx1mService extends AbstractService {
  public queryPV(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MH5pageloadx1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getPvCount().countMerge().toUInt32().rename(
          smartSql.pv,
        ),
      ],
      where,
      groupby,
    });
  }

  public queryPVByCategoryId(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5pageloadx1m();
    return this.queryPV({
      where,
      select: [table.getCategoryId()],
      groupby: [table.getCategoryId()],
    });
  }

  public queryPVByPagePath(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5pageloadx1m();
    return this.queryPV({
      where,
      select: [table.getPagePath()],
      groupby: [table.getPagePath()],
    });
  }

  public queryPagePath(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5pageloadx1m();
    return this.commonQuery(table, {
      where,
      select: [table.getPagePath()],
      groupby: [table.getPagePath()],
    });
  }

  public queryWhiteCount(
    { select = [], where = {}, groupby = [] }: SqlCommonParam,
  ): string {
    const table = new MH5pageloadx1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      where,
      select: [
        ...select,
        table.getWhiteCount().sumMerge().toUInt32().rename(
          smartSql.whiteCount,
        ),
      ],
      groupby,
    });
  }

  public queryWhiteCountByPagePath(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5pageloadx1m();
    return this.queryWhiteCount({
      where,
      select: [table.getPagePath()],
      groupby: [table.getPagePath()],
    });
  }
}
