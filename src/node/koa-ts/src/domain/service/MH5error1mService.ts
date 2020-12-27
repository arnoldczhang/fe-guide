import AbstractService from './AbstractService';
import MH5error1m from '../aggregate/MH5error1m';
import SmartSql from '../../utils/SmartSql';

export default class MH5error1mService extends AbstractService {
  public queryErrorCount(
    { where = {}, groupby = [], select = [] }: SqlCommonParam,
  ): string {
    const table = new MH5error1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      select: [
        ...select,
        table.getErrorCount().countMerge().toUInt32().rename(
          smartSql.jsErrorCount,
        ),
        table.getErrorPV().uniqMerge().toUInt32().rename(
          smartSql.jsErrorCountPV,
        ),
        table.getUserCount().uniqMerge().toUInt32().rename(
          smartSql.jsErrorCountUV,
        )
      ],
      where: {
        ...where,
        errorType: [
          'SyntaxError',
          'TypeError',
          'ReferenceError',
          'RangeError',
          'URIError',
          'Error',
          'UnhandledRejection',
          'Unknow',
        ],
      },
      groupby,
    });
  }

  public queryErrorCountByCategoryId(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5error1m();
    return this.queryErrorCount({
      where,
      select: [
        table.getCategoryId(),
      ],
      groupby: [table.getCategoryId()],
    });
  }

  public queryErrorCountByPagePath(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5error1m();
    const smartSql = SmartSql.quickStart();
    return this.queryErrorCount({
      where,
      select: [
        table.getPagePath().anyMerge().rename(
          smartSql.page,
        ),
      ],
      groupby: [table.getPagePath()],
    });
  }

  public queryErrorMessage(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5error1m();
    const smartSql = SmartSql.quickStart();
    return this.commonQuery(table, {
      where,
      select: [
        table.getErrorMessage().anyMerge().rename(
          smartSql.message,
        ),
        table.getMsgHash(),
      ],
      groupby: [table.getMsgHash()],
    });
  }

  public queryErrorCountByMsg(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5error1m();
    const smartSql = SmartSql.quickStart();
    return this.queryErrorCount({
      where,
      select: [
        table.getErrorMessage().anyMerge().rename(
          smartSql.message,
        ),
      ],
      groupby: [table.getMsgHash()],
    });
  }

  public queryErrorCountByMsgAndPage(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5error1m();
    const smartSql = SmartSql.quickStart();
    return this.queryErrorCount({
      where,
      select: [
        table.getErrorMessage().anyMerge().rename(
          smartSql.message,
        ),
        table.getPagePath().anyMerge().rename(
          smartSql.page,
        ),
        table.getMsgHash(),
      ],
      groupby: [table.getMsgHash(), table.getPagePath()],
    });
  }

  public queryErrorCountByMsgAndCategoryId(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5error1m();
    const smartSql = SmartSql.quickStart();
    return this.queryErrorCount({
      where,
      select: [
        table.getErrorMessage().anyMerge().rename(
          smartSql.message,
        ),
        table.getCategoryId(),
      ],
      groupby: [table.getMsgHash(), table.getCategoryId()],
    });
  }

  public queryEarliestError(
    { where = {} }: SqlCommonParam,
  ): string {
    const table = new MH5error1m();
    return this.commonQuery(table, {
      select: [
        table.getStack(),
        table.getTime(),
      ],
      where,
      orderby: [['time', 'asc']],
      limit: 1,
    });
  }
}
