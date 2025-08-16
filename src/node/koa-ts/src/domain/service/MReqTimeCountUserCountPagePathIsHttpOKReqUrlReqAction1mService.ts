import AbstractService from './AbstractService';
import MReqTimeCountUserCountPagePathIsHttpOKReqUrlReqAction1m from '../aggregate/MReqTimeCountUserCountPagePathIsHttpOKReqUrlReqAction1m';
import SmartSql from '../../utils/SmartSql';

export default class MReqTimeCountUserCountPagePathIsHttpOKReqUrlReqAction1mService
  extends AbstractService {
  public queryApiCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MReqTimeCountUserCountPagePathIsHttpOKReqUrlReqAction1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getCount().countMerge().toUInt32().rename(
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

  public queryApiCountByReqUrl(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MReqTimeCountUserCountPagePathIsHttpOKReqUrlReqAction1m();
    return this.queryApiCount({
      where,
      select: [table.getReqUrl()],
      groupby: [table.getReqUrl()],
    });
  }

  public queryApiErrorCountByReqUrl(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MReqTimeCountUserCountPagePathIsHttpOKReqUrlReqAction1m();
    return this.queryApiErrorCount({
      where,
      select: [table.getReqUrl()],
      groupby: [table.getReqUrl()],
    });
  }
}
