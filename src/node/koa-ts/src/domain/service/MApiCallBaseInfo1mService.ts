import AbstractServiceV2 from './AbstractServiceV2';
import MApiCallBaseInfo1m from '../aggregate/MBaseInfo1m';
import SmartSql from '../../utils/SmartSql';
import {
  NOT_EQ_TAG,
} from '../../utils/SmartSql/const';

const SLOW_REQ_TIME = 3000;
const SUCCESS_STATE = 'success';
export default class MApiCallBaseInfo1mService extends AbstractServiceV2 {
  adaptQuery(
    table: MApiCallBaseInfo1m,
    params: SqlCommonParam,
  ): string {
    const {
      where = {},
    } = params;
    params.where = {
      ...where,
      logType: 'h5Native',
    };
    return this.commonQuery(table, params);
  }

  public queryCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MApiCallBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getAppName().count().toUInt32().rename(
          smartSql.reqTotal,
        ),
      ],
      where,
      groupby,
      orderby: [[smartSql.reqTotal, 'desc']],
    });
  }

  public queryFailCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    return this.queryCount({
      where: {
        ...where,
        ncState: [NOT_EQ_TAG, SUCCESS_STATE],
      },
      groupby,
      select,
    });
  }

  public queryUniqCount({
    where = {}, select = [],
  }: SqlCommonParam): string {
    const table = new MApiCallBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        table.get(select[0] as string).uniq().toUInt32().rename(
          smartSql.count,
        ),
      ],
      where,
    });
  }

  public queryApiCallOriginList({
    where = {}, limit = 10, offset = 0,
  }: SqlCommonParam): string {
    const table = new MApiCallBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
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
        table.getNcBizCode(),
        table.getNcState(),
        table.getNcParams(),
        table.getNcTotalTime(),
        table.getNcErrMsg(),
        table.getAppVersion(),
        table.getPagePath(),
        table.getSdkVersion(),
        table.getLogId(),
      ],
      where: {
        ...where,
        ncState: [NOT_EQ_TAG, SUCCESS_STATE],
      },
      orderby: [['date', 'desc']],
      limit,
      offset,
    });
  }

  public querySlowApiList({
    where = {},
    select = [],
    orderby = [],
    groupby = [],
    offset = 0,
    limit = 10,
  }: SqlCommonParam): string {
    const table = new MApiCallBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getAppName().count().toUInt32().rename(
          smartSql.count,
        ),
        table.getNcTotalTime().gt(SLOW_REQ_TIME)
          .and(table.getNcState().eq(SUCCESS_STATE))
          .countIf()
          .toUInt32()
          .rename(
            smartSql.slowCount,
          ),
        table.getNcTotalTime()
          .avgIf(table.getNcState().eq(SUCCESS_STATE))
          .rename(
            smartSql.successAvgTime,
          ),
        table.getNcTotalTime()
          .avgIf(table.getNcState().notEq(SUCCESS_STATE))
          .rename(
            smartSql.failAvgTime,
          ),
        table.get(smartSql.slowCount).divide(table.get(smartSql.count)).rename(
          smartSql.slowRatio,
        )
      ],
      where,
      offset,
      limit,
      groupby,
      orderby: orderby.length ? orderby : [['slowCount', 'desc']],
    });
  }

  public queryApiDimensionInfo({
    where = {},
    select = [],
    groupby = [],
  }: SqlCommonParam): string {
    const table = new MApiCallBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getAppName().count().toUInt32().rename(
          smartSql.count,
        ),
        table.getNcTotalTime().avgIf(table.getNcState().eq(SUCCESS_STATE))
          .rename(
            smartSql.successAvgTime,
          ),
        table.getNcState().notEq(SUCCESS_STATE).countIf().toUInt32()
          .rename(
            smartSql.failCount,
          ),
        table.get(smartSql.failCount).divide(table.get(smartSql.count)).rename(
          smartSql.failRatio,
        )
      ],
      where,
      groupby,
    });
  }
}
