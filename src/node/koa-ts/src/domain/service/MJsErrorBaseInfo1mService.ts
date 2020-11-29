import SmartSql from '../../utils/SmartSql';
import AbstractService from './AbstractService';
import MJsErrorBaseInfo1m from '../aggregate/MBaseInfo1m';
import MJsError1m from '../aggregate/MJsErrorBaseInfo1m';

export default class MJsErrorBaseInfo1mService extends AbstractService {
  public queryCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MJsError1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getJsErrorCount().countMerge().toUInt32().rename(
          smartSql.jsErrorCount,
        ),
      ],
      where,
      groupby,
    });
  }

  public queryPV(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MJsError1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getErrorPvCount().uniqMerge().toUInt32().rename(
          smartSql.jsErrorPV,
        ),
      ],
      where,
      groupby,
    });
  }

  public queryUV(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MJsError1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getErrorUvCount().uniqMerge().toUInt32().rename(
          smartSql.jsErrorUV,
        ),
      ],
      where,
      groupby,
    });
  }

  public queryStack(
    { where = {}, offset = 0, limit = 1 }: SqlCommonParam,
  ): string {
    const table = new MJsErrorBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        table.getStack(),
        table.getStack().count().toUInt32().rename(smartSql.total),
      ],
      where,
      offset,
      limit,
      groupby: [table.getStack()],
      orderby: [[smartSql.total, 'desc']],
    });
  }

  public queryStackSize(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MJsErrorBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        table.getStack().uniq().rename(
          smartSql.total,
        ),
      ],
      where,
    });
  }

  public queryOriginList(
    { where = {}, offset = 0, limit = 10 }: SqlCommonParam,
  ): string {
    const table = new MJsErrorBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        table.getTime().toUnixTimestamp().multiply(1000).add(
          table.getMillisecond().add(table.getDeltaTime()).group()
            .remind(1000)
        )
          .rename(
            smartSql.date,
          ),
        table.getUserGuid(),
        table.getCategoryId(),
        table.getAppVersion(),
        table.getPagePath(),
        table.getDeviceModel(),
        table.getSdkVersion(),
        table.getLogId(),
      ],
      where,
      orderby: [['date', 'desc']],
      offset,
      limit,
    });
  }

  public queryOriginSize(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MJsErrorBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        table.getAppName().count().toUInt32().rename(
          smartSql.total,
        ),
      ],
      where,
    });
  }
}
