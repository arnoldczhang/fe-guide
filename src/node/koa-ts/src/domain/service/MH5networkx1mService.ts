import AbstractService from './AbstractService';
import MH5networkx1m from '../aggregate/MH5networkx1m';
import SmartSql from '../../utils/SmartSql';

export default class MH5networkx1mService extends AbstractService {
  public queryApiCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MH5networkx1m();
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
        isHTTPOk: 0,
      },
      groupby,
    });
  }

  public queryAvgTime(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MH5networkx1m();
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
    const table = new MH5networkx1m();
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
        isHTTPOk: 1,
      },
      groupby,
    });
  }

  public queryUv(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MH5networkx1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getUserCount().uniqMerge().toUInt32().rename(
          smartSql.uv,
        ),
      ],
      where,
      groupby,
    });
  }

  public queryErrorUv(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    return this.queryUv({
      select,
      where: {
        ...where,
        isHTTPOk: 0,
      },
      groupby,
    });
  }

  public queryApiErrorReqUrl(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5networkx1m();
    return this.commonQuery(table, {
      where: {
        ...where,
        isHTTPOk: 0,
      },
      select: [table.getReqUrl()],
      groupby: [table.getReqUrl(), table.getUrlHash()],
    });
  }

  public queryApiCountByReqUrl(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5networkx1m();
    return this.queryApiCount({
      where,
      select: [table.getReqUrl()],
      groupby: [table.getReqUrl()],
    });
  }

  public queryApiErrorCountByReqUrl(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5networkx1m();
    return this.queryApiErrorCount({
      where,
      select: [table.getReqUrl()],
      groupby: [table.getReqUrl()],
    });
  }

  public queryApiErrorCountByReqUrlHash(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5networkx1m();
    return this.queryApiErrorCount({
      where,
      select: [table.getUrlHash()],
      groupby: [table.getUrlHash()],
    });
  }

  public queryApiCountByReqUrlHash(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5networkx1m();
    return this.queryApiCount({
      where,
      select: [table.getUrlHash()],
      groupby: [table.getUrlHash()],
    });
  }

  public querySizeByReqUrlHash(
    { where = {}, select = [] }: SqlCommonParam,
  ): string {
    const table = new MH5networkx1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getUrlHash().uniq().toUInt32().rename(
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
    const table = new MH5networkx1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getTotal().countMerge().toUInt32().rename(
          smartSql.count,
        ),
        table.getAvgTotalTime().avgMerge().rename(
          smartSql.avgTime,
        ),
        table.getReqUrl().rename(
          table.getReqUrl(),
        ),
        table.getUrlHash(),
      ],
      where,
      offset,
      limit,
      groupby: [
        table.getUrlHash(),
        table.getReqUrl(),
      ],
      orderby: orderby.length ? orderby : [['count', 'desc']],
    });
  }
}
