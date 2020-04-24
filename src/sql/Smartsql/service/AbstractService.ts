import AbstractTable from '../domain/aggregate/AbstractTable';
import { identify } from '../../../sourcemap/sourcemapCompiler/utils';
import {
  NOT_EQ_TAG,
  NOT_IN_TAG,
  GT_TAG,
  GTE_TAG,
  LT_TAG,
  LTE_TAG,
} from '../const';
import SmartSql from '../index';

export default abstract class AbstractService {
  /**
   * 抛异常
   * @param msg String 异常信息
   */
  protected throw(msg: string): void {
    throw new Error(msg);
  }

  /**
   * 校验&抛错
   * @param invalid any 校验式
   * @param msg string 错误信息
   */
  protected valid(invalid: any, msg: string): void {
    if (invalid) {
      this.throw(msg);
    }
  }

  protected validTable(table: any): void {
    this.valid(
      !(table instanceof AbstractTable),
      'table必须为聚合根',
    );
  }

  /**
   * 快捷生成 where 语句
   * @param table string 聚合根
   * @param where ICO where条件
   *
   * 支持的 where 条件
   * - =
   * - !=（数组形式，第一个元素为${NOT_EQ_TAG}）
   * - in
   * - not in（数组形式，第一个元素为${NOT_IN_TAG}）
   *
   */
  protected genWhere(table: any, where: ICO): Array<string | ICalcCollection> {
    this.validTable(table);
    return Object.keys(where).map(
      (key: string) => {
        const value = where[key];
        if (value === '' || value === null || value === undefined) {
          return '';
        }
        if (Array.isArray(value)) {
          if (value.length) {
            const [first, next] = value;
            let result: string | ICalcCollection = '';
            switch (first) {
              case NOT_EQ_TAG:
                result = table.get(key).notEq(next);
                break;
              case NOT_IN_TAG:
                result = table.get(key).notIn(Array.isArray(next) ? next : value.slice(1));
                break;
              case GT_TAG:
                result = table.get(key).gt(next);
                break;
              case GTE_TAG:
                result = table.get(key).gte(next);
                break;
              case LT_TAG:
                result = table.get(key).lt(next);
                break;
              case LTE_TAG:
                result = table.get(key).lte(next);
                break;
              default:
                result = table.get(key).in(value);
                break;
            }
            return result;
          }
          return '';
        }
        return table.get(key).eq(value);
      }
    ).filter(identify);
  }

  /**
   * 通用查询（尊奉者）
   * @param table AbstractTable 聚合根
   * @param params ICO 查询参数
   */
  protected commonQuery(
    table: any,
    params: SqlCommonParam,
  ): string {
    this.validTable(table);
    const {
      select = ['*'],
      where = {},
      groupby = [],
      orderby = [],
      limit
    } = params;
    const {
      beginDate,
      endDate,
      ...otherWhere
    } = where;
    const smartSql = SmartSql.quickStart();
    return table.select(...select)
      .where(
        ...this.genWhere(table, otherWhere),
        beginDate ? table.getTime().gte(
          smartSql[+beginDate].divide(1000).toDateTime()
        ) : '',
        endDate ? table.getTime().lte(
          smartSql[+endDate].divide(1000).toDateTime()
        ) : '',
      )
      .limit(limit || 10000)
      .groupBy(...groupby)
      .orderBy(
        ...(orderby || []).map((item) => {
          const [key, order] = item;
          if (order === 'desc' || order === 'asc') {
            return table.get(key)[order]();
          }
          throw new Error('排序必须为desc或asc');
        })
      )
      .end();
  }
}
