import AbstractServiceV2 from './AbstractServiceV2';
import MHttpRequestBaseInfo1m from '../aggregate/MBaseInfo1m';
import SmartSql from '../../utils/SmartSql';
import {
  GT_TAG,
} from '../../utils/SmartSql/const';

const SLOW_REQ_TIME = 3000;
export default class MHttpRequestBaseInfo1mService extends AbstractServiceV2 {
  adaptQuery(
    table: MHttpRequestBaseInfo1m,
    params: SqlCommonParam,
  ): string {
    const {
      where = {},
    } = params;
    const extraSql = table.getResponseEnd().gt(table.getFetchStart());
    params.where = {
      ...where,
      logType: 'h5Network',
      responseEnd: [GT_TAG, 0],
      fetchStart: [GT_TAG, 0],
      sql: where.sql ? `${extraSql} and ${where.sql}` : extraSql,
    };
    return this.commonQuery(table, params);
  }

  public queryCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MHttpRequestBaseInfo1m();
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
    const table = new MHttpRequestBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getAppName().count().toUInt32().rename(
          smartSql.failReqTotal,
        ),
      ],
      where: {
        ...where,
        sql: where.sql ? `${where.sql} and ${MHttpRequestBaseInfo1m.getFailHttp()}`
          : MHttpRequestBaseInfo1m.getFailHttp(),
      },
      groupby,
      orderby: [[smartSql.failReqTotal, 'desc']],
    });
  }

  public queryBizFailCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MHttpRequestBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getAppName().count().toUInt32().rename(
          smartSql.failReqTotal,
        ),
      ],
      where: {
        ...where,
        sql: where.sql ? `${where.sql} and ${MHttpRequestBaseInfo1m.getBizFailHttp()}`
          : MHttpRequestBaseInfo1m.getBizFailHttp(),
      },
      groupby,
      orderby: [[smartSql.failReqTotal, 'desc']],
    });
  }

  public queryAvgTime(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MHttpRequestBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getResponseEnd().minus(table.getFetchStart())
          .avg()
          .toUInt32()
          .rename(
            smartSql.avgTime,
          ),
      ],
      where: {
        ...where,
        sql: MHttpRequestBaseInfo1m.getFailHttp().not(),
      },
      groupby,
      orderby: [[smartSql.avgTime, 'desc']],
    });
  }

  public queryUV(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MHttpRequestBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getSsid().uniq().toUInt32().rename(
          smartSql.uvCount,
        ),
      ],
      where,
      groupby,
    });
  }

  public queryFailUV(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    return this.queryUV({
      select,
      where: {
        ...where,
        sql: MHttpRequestBaseInfo1m.getFailHttp(),
      },
      groupby,
    });
  }

  public querySizeByReqUrlHash(
    { where = {}, select = [] }: SqlCommonParam,
  ): string {
    const table = new MHttpRequestBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getReqUrlHash().uniq().toUInt32().rename(
          smartSql.size,
        ),
      ],
      where,
      groupby: [],
    });
  }

  public queryReqInfoList({
    where = {},
    select = [],
    orderby = [],
    offset = 0,
    limit = 10,
  }: SqlCommonParam): string {
    const table = new MHttpRequestBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getAppName().count().toUInt32().rename(
          smartSql.count,
        ),
        table.getResponseEnd().minus(table.getFetchStart()).avg().rename(
          smartSql.avgTime,
        ),
        table.getReqUrl().any().rename(
          table.getReqUrl(),
        ),
        MHttpRequestBaseInfo1m.getFailHttp().countIf().toUInt32().rename(
          smartSql.errorCount,
        ),
        table.get(smartSql.errorCount).divide(table.get(smartSql.count)).rename(
          smartSql.errorRatio,
        )
      ],
      where,
      offset,
      limit,
      groupby: [
        table.getReqUrlHash(),
      ],
      orderby: orderby.length ? orderby : [['errorCount', 'desc']],
    });
  }

  public querySlowRequestList({
    where = {},
    select = [],
    orderby = [],
    groupby = [],
    offset = 0,
    limit = 10,
  }: SqlCommonParam): string {
    const table = new MHttpRequestBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getAppName().count().toUInt32().rename(
          smartSql.count,
        ),
        MHttpRequestBaseInfo1m.getFailHttp().countIf().toUInt32().rename(
          smartSql.errorCount,
        ),
        table.getResponseEnd().minus(table.getFetchStart()).gt(SLOW_REQ_TIME)
          .and(MHttpRequestBaseInfo1m.getFailHttp().not())
          .countIf()
          .toUInt32()
          .rename(
            smartSql.slowCount,
          ),
        table.getResponseEnd().minus(table.getFetchStart())
          .avgIf(MHttpRequestBaseInfo1m.getFailHttp().not())
          .rename(
            smartSql.successAvgTime,
          ),
        table.getResponseEnd().minus(table.getFetchStart())
          .avgIf(MHttpRequestBaseInfo1m.getFailHttp())
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

  public queryHttpSlowRequestCount({
    where = {}, select = [],
  }: SqlCommonParam): string {
    const table = new MHttpRequestBaseInfo1m();
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

  public queryHttpSlowRequestTotal({
    where = {}, select = [], groupby = [],
  }: SqlCommonParam): string {
    const table = new MHttpRequestBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    return this.adaptQuery(table, {
      select: [
        ...select,
        table.getResponseEnd().minus(table.getFetchStart()).gt(SLOW_REQ_TIME).countIf()
          .toUInt32()
          .rename(
            smartSql.slowCount,
          ),
      ],
      where: {
        ...where,
        sql: where.sql ? `${where.sql} and ${MHttpRequestBaseInfo1m.getFailHttp().not()}`
          : MHttpRequestBaseInfo1m.getFailHttp().not(),
      },
      groupby,
    });
  }

  public queryHttpOriginList({
    where = {}, limit = 10, offset = 0,
  }: SqlCommonParam): string {
    const table = new MHttpRequestBaseInfo1m();
    const smartSql = SmartSql.quickStart();
    const errorSql = `(${MHttpRequestBaseInfo1m.getFailHttp()} or ${MHttpRequestBaseInfo1m.getBizFailHttp()})`;
    return this.adaptQuery(table, {
      select: [
        table.getTime().toUnixTimestamp().multiply(1000).add(
          table.getMillisecond().add(table.getDeltaTime()).group()
            .remind(1000)
        )
          .rename(
            smartSql.date,
          ),
        table.getHttpResponseCode(),
        table.getBusinessCode(),
        table.getResponseEnd().minus(table.getFetchStart()).rename(
          smartSql.requestTime,
        ),
        table.getUserGuid(),
        table.getReqContentLength(),
        table.getCategoryId(),
        table.getAppVersion(),
        table.getPagePath(),
        table.getNetworkType(),
        table.getSdkVersion(),
        table.getAdCode(),
        table.getLogId(),
      ],
      where: {
        ...where,
        sql: where.sql ? `${where.sql} and ${errorSql}`
          : errorSql,
      },
      orderby: [['date', 'desc']],
      limit,
      offset,
    });
  }
}
