import { AbstractController, action } from './AbstractController';
import DimensionService from '../service/DimensionErrorService';

import dayjs = require('dayjs');

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

export default class ApiCallController extends AbstractController {
  /**
   * 分页获取堆栈信息
   * @param param0 p
   */
  @action('post', '/error/stack', commonParamTypes)
  async getStack({
    where,
    start = 0,
    limit = 1,
  }: RequestParamType): Promise<any> {
    const service = new DimensionService();
    where.msgHash = Number(where.msgHash);
    if (where.pathHash) {
      where.pathHash = Number(where.pathHash);
    }
    where.beginDate = new Date(where.beginDate);
    where.endDate = new Date(where.endDate);
    try {
      const [data, total] = await Promise.all([
        service.getStackGroupBy({
          where,
          offset: start,
          limit,
        }),
        service.getStackSize({
          where,
        }),
      ]);
      return this.createSuccessResponse<any>({
        data: data[0].stack,
        total: total.total,
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 异常原始日志列表
   * @param param0 param
   */
  @action('post', '/error/originlist', commonParamTypes)
  async getOriginlist({
    where,
    start = 0,
    limit = 10,
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const [tableData, total] = await Promise.all([
        service.queryOriginList({
          where,
          offset: start,
          limit,
        }),
        service.queryOriginSize({ where }),
      ]);

      return this.createSuccessResponse<any>({
        data: (tableData || []).map((data: ICO) => ({
          ...data,
          date: dayjs(+data.date).format('YYYY-MM-DD HH:mm:ss.SSS'),
        })),
        total: total.total,
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }
}
