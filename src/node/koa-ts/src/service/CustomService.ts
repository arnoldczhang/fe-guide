import AbstractService from './AbstractService';
import SmartSql from '../utils/SmartSql/index';
import { appendCommonParams, getTimeKey, defaultTable } from '../utils/helper';

const genWhereArray = (
  q: SmartSql,
  where: ICO,
  backupWhere: ICO,
): string[] => ('sql' in where ? [where.sql] : Object.keys(backupWhere || {})
  .map((key: string): string => (
    q[key][Array.isArray(backupWhere[key]) ? 'in' : 'eq'](backupWhere[key])
  )));

export default class CustomService extends AbstractService {
  /**
   * 自定义搜索
   *
   * 所有条件外部自定义
   *
   * @param param0
   */
  public async getCustomSearch({
    select = [],
    where,
    groupby,
    orderby,
    table,
    offset,
    limit,
  }: {
    select?: string[];
    where: ICO;
    groupby: string[];
    orderby?: string[][];
    table?: string;
    offset?: number;
    limit?: number;
  }, option?: ICO): Promise<any> {
    const { countless = false } = option || {};
    const q = SmartSql.quickStart();
    const {
      beginDate,
      endDate,
      ...otherWhere
    } = where;
    const whereSql = genWhereArray(q, where, otherWhere);
    const tableName = table || defaultTable;
    const sql = SmartSql.generateSql({
      table: this.getTableName(tableName),
      select: select.concat(countless ? '' : q[1].count().rename(q.count)),
      where: [
        appendCommonParams({ beginDate, endDate }, tableName),
        ...whereSql
      ],
      groupby,
      orderby: (orderby || []).map((orderItem: string[]) => {
        const [key, order] = orderItem;
        return q[key][order]();
      }),
      limit: limit ? [limit] : null,
      offset,
    });
    const data = await this.queueQueryData<any>(sql);
    return data;
  }

  /**
   * 自定义趋势
   *
   * groupby 和 orderby 默认按时间，其他条件外部自定义
   *
   * @param param0
   */
  public async getCustomTendency({
    select,
    where,
    groupby,
    table,
    interval,
  }: {
    select: string[],
    where: ICO,
    groupby?: string[],
    orderby?: string[][],
    interval?: Interval,
    table?: string,
  }, option?: ICO): Promise<any> {
    const { countless = false } = option || {};
    const q = SmartSql.quickStart();
    const {
      beginDate,
      endDate,
      ...otherWhere
    } = where;
    const whereSql = genWhereArray(q, where, otherWhere);
    const tableName = table || defaultTable;
    const time = getTimeKey(tableName);
    const sql = SmartSql.generateSql({
      table: this.getTableName(tableName),
      select: [
        q[time]
          .interval(this.getInterval(interval || '5m'))
          .toStartOfInterval()
          .toUnixTimestamp()
          .rename(q.atime),
        countless ? '' : q[1].count().toUInt32().rename(q.count),
        ...select
      ],
      where: [
        appendCommonParams({ beginDate, endDate }, tableName),
        ...whereSql
      ],
      groupby: [q.atime, ...(groupby || [])],
      orderby: [q.atime.asc()],
    });
    const data = await this.queueQueryData<{ atime: Number, [key: string]: any}>(sql);
    return data.map(({ atime, ...other }) => ({
      time: atime,
      ...other,
    }));
  }

  /**
   * 自定义查总数
   *
   * @param param0
   */
  public async getCustomCount({
    select,
    where,
    table,
  }: {
    select: string[],
    where: ICO,
    table?: string,
  }): Promise<any> {
    const q = SmartSql.quickStart();
    const {
      beginDate,
      endDate,
      ...otherWhere
    } = where;
    const whereSql = genWhereArray(q, where, otherWhere);
    const tableName = table || defaultTable;
    const sql = SmartSql.generateSql({
      table: this.getTableName(tableName),
      select: [
        q[select.join()].uniq().rename(q.total)
      ],
      where: [
        appendCommonParams({ beginDate, endDate }, tableName),
        ...whereSql
      ],
    });
    const data = await this.queueQuery<any>(sql);
    return data.data;
  }

  /**
   * 自定义-通用饼图查询
   *
   * @param param0
   */
  public async getCustomPie({
    dimension,
    dimensionless,
    select,
    where,
    table,
    limit,
  }: {
    select?: string[];
    dimension?: string;
    dimensionless?: boolean|void;
    where: ICO;
    table?: string;
    limit?: number;
  }): Promise<any> {
    const q = SmartSql.quickStart();
    const {
      beginDate,
      endDate,
      ...otherWhere
    } = where;
    const whereSql = genWhereArray(q, where, otherWhere);
    const tableName = table || defaultTable;
    const sql = SmartSql.generateSql({
      table: this.getTableName(tableName),
      select: [
        !dimensionless && dimension ? q[dimension].rename(q.dimension) : null,
        ...(select || []),
        q[1].count().toUInt32().rename(q.value),
      ],
      where: [
        appendCommonParams({ beginDate, endDate }, tableName),
        ...whereSql
      ],
      groupby: [
        dimension ? q[dimension] : null,
      ],
      orderby: [q.value.desc()],
      limit: limit ? [limit] : null,
    });
    console.log('sql=>', sql);
    const data = await this.queueQuery<any>(sql);
    return data.data;
  }

  /**
   * 自定义-number类型字段step求总数
   *
   * @param param0
   */
  public async getStepCount({
    key,
    start = 0,
    step = 100,
    end = 1000,
    where,
    table,
    limit,
    groupby,
    orderby,
  }: {
    key: string;
    start?: number;
    step?: number;
    end: number;
    where: ICO;
    table?: string;
    limit?: number;
    groupby?: string[];
    orderby?: string[];
  }): Promise<any> {
    const q = SmartSql.quickStart();
    const {
      beginDate,
      endDate,
      ...otherWhere
    } = where;
    const whereSql = genWhereArray(q, where, otherWhere);
    const tableName = table || defaultTable;
    const sql = SmartSql.generateSql({
      table: this.getTableName(tableName),
      select: [
        ...Array.from({ length: Math.floor(end / step) })
          .fill(start)
          .map((num: any, index: number): string => q[key]
            .gt(num + index * step)
            .and(q[key])
            .lt(num + (index + 1) * step)
            .nullIf(start)
            .count()
            .as(q[`count_${num + index * step}`])),
      ],
      where: [
        appendCommonParams({ beginDate, endDate }, tableName),
        ...whereSql
      ],
      groupby: groupby || undefined,
      orderby: orderby || undefined,
      limit: limit ? [limit] : null,
    });
    const data = await this.queueQuery<any>(sql);
    return data.data;
  }

  /**
   * sql直接查询（限管理员）
   * @param sql string sql
   */
  public async getMasterSearch(sql: string): Promise<any> {
    const data = await this.queueQuery<any>(sql);
    return data.data;
  }
}
