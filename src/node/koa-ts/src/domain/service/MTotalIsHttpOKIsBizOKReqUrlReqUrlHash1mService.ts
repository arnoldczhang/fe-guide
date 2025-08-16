import AbstractService from './AbstractService';
import MTotalIsHttpOKIsBizOKReqUrlReqUrlHash1m from '../aggregate/MTotalIsHttpOKIsBizOKReqUrlReqUrlHash1m';
import SmartSql from '../../utils/SmartSql';

export default class MTotalIsHttpOKIsBizOKReqUrlReqUrlHash1mService extends AbstractService {
  public queryCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MTotalIsHttpOKIsBizOKReqUrlReqUrlHash1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getTotal().countMerge().toUInt32().rename(
          smartSql.reqTotal,
        ),
      ],
      where,
      groupby,
    });
  }

  public queryFailCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    return this.queryCount({
      select,
      where: {
        ...where,
        isHTTPOk: 0,
      },
      groupby,
    });
  }

  public queryBizFailCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    return this.queryCount({
      select,
      where: {
        ...where,
        isBizOK: 0,
      },
      groupby,
    });
  }
}
