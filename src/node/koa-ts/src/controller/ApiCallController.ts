import { AbstractController, action } from './AbstractController';
import { getCompareText } from './HttpRequestController';
import DimensionNativeAPIService from '../service/DimensionNativeAPIService';
import {
  flattenObj,
  getPctFormat,
  getTrend,
  getTrendText,
  thousandsFmt,
  getCompareRatio,
  formatZeroPct,
} from '../utils/helper';
import {
  NOT_EQ_TAG,
} from '../utils/SmartSql/const';

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

const DAY = 1000 * 60 * 60 * 24;

const bizMsgRE = /"(?:error|)Message":"([^"]+)"/i;
const collectBizMsg = (msg: string): string => {
  try {
    const { errorMessage = '', message = '' } = JSON.parse(msg);
    return errorMessage || message;
  } catch (err) {
    const result = bizMsgRE.exec(msg);
    if (result) {
      return result[1];
    }
    return '';
  }
};

export default class ApiCallController extends AbstractController {
  /**
   * NativeAPI调用总览数据
   *
   * @param param0
   */
  @action('post', '/apiCall/overall', commonParamTypes)
  async overall({
    where,
  }: RequestParamType): Promise<any> {
    try {
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const nowWhere = { ...where };

      const beforeWhere = {
        ...where,
        beginDate: new Date(where.beginDate.getTime() - DAY),
        endDate: new Date(where.endDate.getTime() - DAY),
      };

      const service = new DimensionNativeAPIService();
      const result = await Promise.all([
        beforeWhere,
        nowWhere,
      ].map((param) => Promise.all([
        service.querySuccessAvgTime(param),
        service.queryCount(param),
        service.queryErrorCount(param),
      ]).then(flattenObj)));
      const [lastResult, nowResult] = result;
      const finalResult: ICO[] = Object.keys(nowResult).reduce((res: ICO[], key) => {
        const lastValue = lastResult[key] || 0;
        const nowValue = nowResult[key] || 0;
        const diffValue = nowValue - lastValue;
        const statistics: ICO = {
          desc: '日同比',
        };
        switch (key) {
          case 'avgTime':
            statistics.label = '调用成功平均耗时';
            statistics.value = nowValue ? `${thousandsFmt(parseInt(nowValue, 10))}ms` : '-';
            break;
          case 'count':
            statistics.label = '调用数';
            statistics.value = nowValue !== null ? String(thousandsFmt(nowValue)) : '-';
            break;
          case 'errorCount':
            statistics.label = '调用失败数';
            statistics.value = nowValue !== null ? String(thousandsFmt(nowValue)) : '-';
            break;
          default:
            break;
        }

        if (statistics.label) {
          statistics.trend = getTrend(diffValue);
          const percentValue = getCompareRatio(nowValue, lastValue);
          statistics.variety = getTrendText(+getPctFormat(percentValue, false), '%');
          res.push(statistics);
        }
        return res;
      }, []);

      // 单独计算失败率
      const todayRatio = Math.min(nowResult.errorCount / nowResult.count || 0, 1);
      const yestdayRatio = Math.min(lastResult.errorCount / lastResult.count || 0, 1);
      const percentValue = getCompareRatio(todayRatio, yestdayRatio);
      finalResult.push({
        desc: '日同比',
        label: '调用失败率',
        value: todayRatio !== null ? getPctFormat(todayRatio) : '-',
        trend: getTrend(todayRatio - yestdayRatio),
        variety: getTrendText(+getPctFormat(percentValue, false), '%'),
      });
      return this.createSuccessResponse<any>(finalResult);
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * api调用表格数据
   *
   * @param param0
   */
  @action('post', '/apiCall/tableDetail', commonParamTypes)
  async tableDetail({
    select = [],
    where,
    groupby = [],
    orderby = [],
    start = 0,
    limit = 10,
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionNativeAPIService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);

      const [todayData, countRes] = await Promise.all([
        service.queryApiInfoList({
          select,
          where,
          groupby,
          orderby,
          offset: start,
          limit,
        }),
        service.queryApiSize({ where }),
      ]);

      const targetNcMethod = todayData.map(({ ncMethod }: { ncMethod: string }) => ncMethod);

      const yestdayWhere = {
        ...where,
        ncMethod: targetNcMethod,
        beginDate: new Date(where.beginDate.getTime() - DAY),
        endDate: new Date(where.endDate.getTime() - DAY),
      };

      const [
        todayFailData,
        yestdayFailData,
        yestdayData,
      ] = await Promise.all([
        service.queryErrorCountGroupBy({
          select: ['ncMethod'],
          where: {
            ...where,
            ncMethod: targetNcMethod,
          },
          groupby: ['ncMethod'],
        }),
        service.queryErrorCountGroupBy({
          select: ['ncMethod'],
          where: yestdayWhere,
          groupby: ['ncMethod'],
        }),
        service.queryApiInfoList({ where: yestdayWhere }),
      ]);

      const result = todayData.map(({
        ncMethod,
        avgTime,
        count,
      }: ICO) => {
        const todayFail = todayFailData.find((data: ICO) => data.ncMethod === ncMethod);
        const yestdayAvgTime = yestdayData.find((data: ICO) => data.ncMethod === ncMethod);
        const yestdayFail = yestdayFailData.find((data: ICO) => data.ncMethod === ncMethod);
        const yestdayAll = yestdayData.find((data: ICO) => data.ncMethod === ncMethod);
        const todayRatio = todayFail ? todayFail.count / count : 0;
        const yestdayRatio = yestdayFail && yestdayAll ? yestdayFail.count / yestdayAll.count : 0;
        const compareCount = getCompareRatio(count, yestdayAll ? (yestdayAll.count || 0) : 0);
        const compareRatio = getCompareRatio(todayRatio, yestdayRatio);
        const compareAvgTime = getCompareRatio(
          avgTime, yestdayAvgTime ? (yestdayAvgTime.avgTime || 0) : 0
        );

        return {
          ncMethod,
          avgTime: parseInt(avgTime, 10),
          count,
          errorRatio: getPctFormat(todayRatio, false),
          compareCount: getCompareText(compareCount),
          compareAvgTime: getCompareText(compareAvgTime),
          compareRatio: getCompareText(compareRatio),
        };
      });

      return this.createSuccessResponse<any>({
        data: result,
        total: Number(countRes.size),
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 慢调用列表
   *
   * @param param0
   */
  @action('post', '/apiCall/slowRequest/list', commonParamTypes)
  async slowRequestList({
    where,
    groupby = [],
    orderby = [],
    start = 0,
    limit = 10,
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionNativeAPIService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const [data, total] = await Promise.all([
        service.queryApiSlowRequestList({
          select: groupby,
          where,
          offset: start,
          limit,
          groupby,
          orderby,
        }),
        service.queryUniqCount({
          select: groupby,
          where,
        }),
      ]);

      return this.createSuccessResponse<any>({
        data: data.map((item: ICO) => ({
          ...item,
          count: thousandsFmt(item.count),
          failAvgTime: `${thousandsFmt(parseInt(item.failAvgTime, 10))}ms`,
          successAvgTime: `${thousandsFmt(parseInt(item.successAvgTime, 10))}ms`,
          slowCount: thousandsFmt(item.slowCount),
          slowRatio: getPctFormat(item.slowRatio),
        })),
        total: total.count,
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 异常实例列表
   *
   * @param param0
   */
  @action('post', '/apiCall/detail/originlist', commonParamTypes)
  async apiDetailOriginList({
    where,
    start = 0,
    limit = 10,
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionNativeAPIService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const [tableData, [total]] = await Promise.all([
        service.queryApiCallOriginList({
          where,
          offset: start,
          limit,
        }),
        service.queryApiFailCount({ where }),
      ]);

      return this.createSuccessResponse<any>({
        data: tableData.map((data: ICO) => ({
          ...data,
          date: dayjs(+data.date).format('YYYY-MM-DD HH:mm:ss.SSS'),
          requestTime: `${thousandsFmt(data.ncTotalTime)}ms`,
        })),
        total: total.reqTotal,
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 普通维度分析
   *
   * @param param0
   */
  @action('post', '/apiCall/dimension/info', commonParamTypes)
  async apiCallDimensionInfo({
    where,
    groupby = [],
    orderby = [],
    start = 0,
    limit = 10,
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionNativeAPIService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);

      const yestdayWhere = {
        ...where,
        beginDate: new Date(where.beginDate.getTime() - DAY),
        endDate: new Date(where.endDate.getTime() - DAY),
      };

      const [
        todayData,
        total,
        yestdayData,
      ] = await Promise.all([
        service.queryApiDimensionInfo({
          select: groupby,
          where,
          groupby,
        }),
        service.queryUniqCount({
          select: groupby,
          where,
        }),
        service.queryApiDimensionInfo({
          select: groupby,
          where: yestdayWhere,
          groupby,
        }),
      ]);

      const [[key = 'count', dir = 'desc']] = orderby;
      const dimension = groupby[0];
      const countAll = todayData.reduce((res: number, pre: ICO) => res + pre.count, 0);
      const failCountAll = todayData.reduce((res: number, pre: ICO) => res + pre.failCount, 0);
      const yestdayFailCountAll = yestdayData.reduce(
        (res: number, pre: ICO) => res + pre.failCount, 0
      );
      return this.createSuccessResponse<any>({
        data: todayData.map(({
          [dimension]: k,
          count,
          successAvgTime,
          failCount,
          failRatio,
        }: ICO) => {
          const yestday = yestdayData.find(
            (item: ICO) => item[dimension] === k
          ) || {};
          return {
            dimension: k,
            // 调用数
            count,
            // 调用数（相比昨日）
            countDiff: count - (yestday.count || 0),
            // 调用数（日同比）
            countDiffRatio: getCompareRatio(count, yestday.count || 0),
            // 调用占比
            countRatio: count / countAll,
            // 调用成功耗时
            successAvgTime,
            // 调用成功耗时（相比昨日）
            successAvgTimeDiff: successAvgTime - (yestday.successAvgTime || 0),
            // 调用成功耗时（日同比）
            successAvgTimeDiffRatio: getCompareRatio(successAvgTime, yestday.successAvgTime || 0),
            // 调用失败数
            failCount,
            // 调用失败数（相比昨日）
            failCountDiff: failCount - (yestday.failCount || 0),
            // 调用失败占比
            failCountRatio: failCount / failCountAll,
            originFailCountRatioDiff: failCount / failCountAll
              - (yestday.failCount || 0) / yestdayFailCountAll,
            // 调用失败率
            failRatio,
          };
        }).sort(
          dir === 'desc'
            ? (pre: ICO, next: ICO): any => (next[key] - pre[key])
            : (pre: ICO, next: ICO): any => (pre[key] - next[key])
        ).splice(start, limit).map((item: ICO) => ({
          ...item,
          originCount: item.count,
          count: thousandsFmt(item.count),
          originCountDiff: item.countDiff,
          countDiff: `${item.countDiff > 0 ? '+' : ''}${thousandsFmt(item.countDiff)}`,
          countDiffRatio: getTrendText(Number(getPctFormat(item.countDiffRatio, false)), '%'),
          originCountRatio: getPctFormat(item.countRatio),
          countRatio: formatZeroPct(getPctFormat(item.countRatio)),
          successAvgTime: `${thousandsFmt(parseInt(item.successAvgTime, 0))}ms`,
          successAvgTimeDiff: `${item.successAvgTimeDiff > 0 ? '+' : ''}${thousandsFmt(parseInt(item.successAvgTimeDiff, 0))}ms`,
          successAvgTimeDiffRatio: getTrendText(Number(getPctFormat(item.successAvgTimeDiffRatio, false)), '%'),
          failCount: thousandsFmt(item.failCount),
          failCountDiff: `${item.failCountDiff > 0 ? '+' : ''}${thousandsFmt(item.failCountDiff)}`,
          // 调用失败占比（日同比），注意这里用差值，而非百分比，即绝对值的变化超过20%才算异常
          failCountRatioDiff: getTrendText(Number(getPctFormat(item.originFailCountRatioDiff, false)), '%'),
          originFailRatio: getPctFormat(item.failRatio),
          failRatio: formatZeroPct(getPctFormat(item.failRatio)),
        })),
        total: total.count,
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 获取api调用按 ncBizCode 分组后的信息
   *
   * @param param0
   */
  @action('post', '/apiCall/dimension/bizCode', commonParamTypes)
  async getNcBizCodeList({
    select = [],
    where,
    limit = 5,
    groupby = ['ncBizCode', 'ncErrMsg'],
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionNativeAPIService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);

      let data = await service.queryApiCountGroupBy({
        select: groupby.concat(select),
        where: {
          ...where,
          ncState: [NOT_EQ_TAG, 'success'],
        },
        groupby,
      });

      data = data.reduce((res: ICO[], { ncBizCode, ncErrMsg, reqTotal }: ICO) => {
        const matched = res.find((item: ICO) => item.ncBizCode === ncBizCode);
        const msg = collectBizMsg(ncErrMsg);
        if (matched) {
          matched.reqTotal += Number(reqTotal);
          // 暂时只读取第一个errMsg
          // if (msg) {
          //   matched.ncErrMsg.add(msg);
          // }
        } else {
          const set = new Set();
          if (msg) {
            set.add(msg);
          }
          res.push({
            ncBizCode,
            ncErrMsg: set,
            reqTotal,
          });
        }
        return res;
      }, []);

      const countTotal = data.reduce((res: number, pre: ICO) => res + pre.reqTotal, 0);
      return this.createSuccessResponse<any>({
        data: data.map((item: ICO) => ({
          ...item,
          count: thousandsFmt(item.reqTotal),
          // 失败数
          value: item.reqTotal,
          // 这个 key 给饼图用
          dimension: item.ncBizCode,
          ncErrMsg: [...item.ncErrMsg],
          // 失败数占比
          ratio: getPctFormat(item.reqTotal / countTotal),
        })).slice(0, limit),
        total: Math.min(data.length, limit),
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }
}
