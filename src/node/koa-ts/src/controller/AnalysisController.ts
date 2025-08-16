// eslint-disable-next-line no-unused-vars
import { AbstractController, action } from './AbstractController';
import CustomService from '../service/CustomService';

const commonParamTypes: Readonly<any> = {
  select: '?',
  table: '?',
  where: true,
  groupby: '?',
  orderby: '?',
  interval: '?',
  readonly: '?',
  start: '?',
  limit: '?',
};

type RequestParamType = {
  select?: string[];
  where: ICO;
  table?: string;
  groupby?: string[];
  orderby?: string[][];
  interval?: Interval;
  readonly?: boolean;
  start?: number;
  limit?: number;
};

export default class AnalysisController extends AbstractController {
  @action('post', '/analysis/custom/search', commonParamTypes)
  async customSearch({
    select = [],
    where,
    groupby = [],
    orderby = [],
    start = 0,
    table = '',
    limit = 10,
  }: RequestParamType): Promise<any> {
    try {
      const service = new CustomService();
      const {
        beginDate: [beginDate],
        endDate: [endDate],
        ...otherWhere
      } = where;
      const otherWhereValued: ICO = {};
      Object.keys(otherWhere).forEach((key: string) => {
        const value = otherWhere[key];
        if (value !== null && value !== undefined) {
          otherWhereValued[key] = value;
        }
      });
      const [dataNow, countRes] = await Promise.all([
        service.getCustomSearch({
          select,
          table,
          where: {
            beginDate,
            endDate,
            ...otherWhereValued
          },
          groupby,
          orderby,
          offset: start,
          limit,
        }),
        service.getCustomSearch({
          select: [`toInt32(uniq(${groupby.join(', ')})) total`],
          table,
          where: {
            beginDate,
            endDate,
            ...otherWhereValued
          },
          groupby: [],
        }),
      ]);
      return this.createSuccessResponse<any>({
        data: dataNow,
        total: Number(countRes[0].total),
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  @action('post', '/analysis/custom/tendency', commonParamTypes)
  async customTendency({
    select = [],
    where,
    orderby = [],
    interval,
  }: RequestParamType): Promise<any> {
    let today;
    let yesterday;
    try {
      const service = new CustomService();
      const {
        beginDate,
        endDate,
        ...otherWhere
      } = where;
      const otherWhereValued: ICO = {};
      Object.keys(otherWhere).forEach((key: string) => {
        const value = otherWhere[key];
        if (value !== null && value !== undefined) {
          otherWhereValued[key] = value;
        }
      });

      if (beginDate.length !== endDate.length) {
        return this.createSuccessResponse<any>([]);
      }
      [today, yesterday] = await Promise.all(beginDate.map(
        (date: string, index: number) => service.getCustomTendency({
          select,
          where: {
            beginDate: date,
            endDate: endDate[index],
            ...otherWhereValued
          },
          interval,
          orderby,
        })
      ));
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
    return this.createSuccessResponse<any>({ today, yesterday });
  }

  @action('post', '/analysis/custom/sql', { sql: true })
  async customMasterSearch({
    sql = '',
  }: { sql: string }): Promise<any> {
    try {
      const service = new CustomService();
      const result = await service.getMasterSearch(sql);
      return this.createSuccessResponse<any>(result);
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }
}
