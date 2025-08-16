import { NOT_EQ_TAG } from '../utils/SmartSql/const';
import { AbstractController, action } from './AbstractController';
import DimensionService from '../service/DimensionService';
import {
  flattenObj,
  getPctFormat,
  getTrend,
  getTrendText,
  thousandsFmt,
  getCompareRatio,
  getProvinceCode,
  isAdCodeValid,
} from '../utils/helper';
import { getHttpCodeMessage } from '../const';

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

export const getCompareText = (
  compare: number,
  percent = false,
): string => `${compare > 0 ? '+' : ''}${getPctFormat(compare, percent)}`;

export default class HttpRequestController extends AbstractController {
  /**
   * 网络请求总览数据
   *
   * @param param0
   */
  @action('post', '/http/overall', commonParamTypes)
  async overall({
    where,
  }: RequestParamType): Promise<any> {
    try {
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const beforeWhere = {
        ...where,
        beginDate: new Date(where.beginDate.getTime() - DAY),
        endDate: new Date(where.endDate.getTime() - DAY),
      };
      const nowWhere = { ...where };
      const service = new DimensionService();
      const result = await Promise.all([
        beforeWhere,
        nowWhere,
      ].map((param) => {
        const {
          urlHash,
          ...otherParam
        } = param;
        const otherWhere = {
          ...otherParam,
          reqUrlHash: urlHash,
        };
        return Promise.all([
          service.queryHttpAvgTimeV2({ where: otherWhere }).then((res: ICO[]) => (res[0] || {})),
          service.queryApiCount(param),
          service.queryHttpErrorCountAndRatio({ where: otherWhere }),
          service.queryApiErrorUv(param),
        ]).then(flattenObj);
      }));
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
            statistics.label = '请求成功平均耗时';
            statistics.value = nowValue ? `${thousandsFmt(parseInt(nowValue, 10))}ms` : '-';
            break;
          case 'apiCount':
            statistics.label = '请求数';
            statistics.value = nowValue !== null ? String(thousandsFmt(nowValue)) : '-';
            break;
          case 'apiErrorRatioOrigin':
            statistics.label = '请求失败率';
            statistics.value = nowValue !== null ? getPctFormat(nowValue) : '-';
            break;
          case 'uv':
            statistics.label = '请求失败影响用户数';
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
      return this.createSuccessResponse<any>(finalResult);
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 网络请求表格数据
   *
   * @param param0
   */
  @action('post', '/http/tableDetail', commonParamTypes)
  async tableDetail({
    select = [],
    where,
    groupby = [],
    orderby = [],
    start = 0,
    limit = 10,
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);

      // 1. 查询网络请求分类信息、种类数
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
      const targetUrlHash = todayData.map(({ urlHash }: { urlHash: number }) => urlHash);

      const yestdayWhere: ICO = {
        ...where,
        urlHash: targetUrlHash,
        beginDate: new Date(where.beginDate.getTime() - DAY),
        endDate: new Date(where.endDate.getTime() - DAY),
      };

      // 暂时这么处理，等统一物化视图就能确认urlHash字段
      const urlHashRe = /and urlHash=-?\d+/;

      const fullTodayParam = {
        select: ['reqUrlHash'],
        where: {
          ...where,
          sql: where.sql.replace(urlHashRe, ''),
          reqUrlHash: targetUrlHash,
          urlHash: null,
        },
        groupby: ['reqUrlHash'],
      };

      const fullYestdayParam = {
        select: ['reqUrlHash'],
        where: {
          ...yestdayWhere,
          sql: yestdayWhere.sql.replace(urlHashRe, ''),
          reqUrlHash: targetUrlHash,
          urlHash: null,
        },
        groupby: ['reqUrlHash'],
      };

      const [
        // 2. 查询网络请求失败数、平均耗时
        todayFailData,
        todayBizFailData,
        yestdayBizFailData,
        // 3. 查询同比昨天的网络请求失败数、总请求数、平均耗时
        yestdayAvgTimeData,
        yestdayFailData,
        yestdayData,
      ] = await Promise.all([
        service.queryHttpErrorCount(fullTodayParam),
        service.queryHttpBizErrorCountAndRatio(fullTodayParam),
        service.queryHttpBizErrorCountAndRatio(fullYestdayParam),
        service.queryApiAvgTimeByHash({ where: yestdayWhere }),
        service.queryHttpErrorCount(fullYestdayParam),
        service.queryApiCountByHash({ where: yestdayWhere }),
      ]);

      const result = todayData.map(({
        urlHash,
        reqUrl,
        avgTime,
        count,
      }: ICO) => {
        const todayFail = todayFailData.find((data: ICO) => data.reqUrlHash === urlHash);
        const todayBizFail = todayBizFailData.find((data: ICO) => data.reqUrlHash === urlHash);
        const yestdayBizFail = yestdayBizFailData.find((data: ICO) => data.reqUrlHash === urlHash);
        const yestdayAvgTime = yestdayAvgTimeData.find((data: ICO) => data.urlHash === urlHash);
        const yestdayFail = yestdayFailData.find((data: ICO) => data.reqUrlHash === urlHash);
        const yestdayAll = yestdayData.find((data: ICO) => data.urlHash === urlHash);
        const todayRatio = todayFail ? todayFail.reqTotal / count : 0;
        const todayBizRatio = todayBizFail ? todayBizFail.reqTotal / count : 0;
        const yestdayBizRatio = yestdayBizFail ? yestdayBizFail.reqTotal / count : 0;
        const yestdayRatio = yestdayFail && yestdayAll
          ? yestdayFail.reqTotal / yestdayAll.count : 0;
        const compareCount = getCompareRatio(count, yestdayAll ? (yestdayAll.count || 0) : 0);
        const compareRatio = getCompareRatio(todayRatio, yestdayRatio);
        const compareBizRatio = getCompareRatio(todayBizRatio, yestdayBizRatio);
        const compareAvgTime = getCompareRatio(
          avgTime, yestdayAvgTime ? (yestdayAvgTime.avgTime || 0) : 0
        );
        return {
          urlHash,
          reqUrl,
          avgTime: parseInt(avgTime, 10),
          count,
          errorRatio: getPctFormat(todayRatio, false),
          bizErrorRatio: getPctFormat(todayBizRatio, false),
          compareCount: getCompareText(compareCount),
          compareAvgTime: getCompareText(compareAvgTime),
          compareRatio: getCompareText(compareRatio),
          compareBizRatio: getCompareText(compareBizRatio),
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
   * 网络请求（业务）失败率按维度划分
   *
   * @param param0
   */
  @action('post', '/http/dimension/failRatio', { ...commonParamTypes, errorType: '?' })
  async dimensionRatio({
    where,
    groupby = [],
    limit = 5,
    errorType = 'reqFailRatio',
  }: RequestParamType & { errorType ?: string }): Promise<any> {
    try {
      const service = new DimensionService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const param = {
        where,
        groupby,
        select: groupby,
      };
      const [key] = groupby;
      let [countList, errorCountList] = await Promise.all([
        service.queryHttpCountV2(param),
        errorType === 'reqFailRatio' ? service.queryHttpFailCountV2(param)
          : service.queryHttpBizFailCount(param),
      ]);

      const countTotal = countList.reduce(
        (res: number, pre: ICO) => res + pre.reqTotal, 0
      );
      const countFailTotal = errorCountList.reduce(
        (res: number, pre: ICO) => res + pre.failReqTotal, 0
      );

      if (key === 'adCode') {
        let countMap = countList.reduce((res: ICO, city: ICO) => {
          let { adCode } = city;
          if (isAdCodeValid(adCode)) {
            const { reqTotal } = city;
            adCode = getProvinceCode(adCode);
            res[adCode] = res[adCode] || 0;
            res[adCode] += reqTotal;
          }
          return res;
        }, {});

        countList = Object.keys(countMap).map((k: string | number) => ({
          [key]: k,
          reqTotal: countMap[k],
        }));

        countMap = errorCountList.reduce((res: ICO, city: ICO) => {
          let { adCode } = city;
          if (isAdCodeValid(adCode)) {
            const { failReqTotal } = city;
            adCode = getProvinceCode(adCode);
            res[adCode] = res[adCode] || 0;
            res[adCode] += failReqTotal;
          }
          return res;
        }, {});

        errorCountList = Object.keys(countMap).map((k: string | number) => ({
          [key]: k,
          failReqTotal: countMap[k],
        }));
      }

      const result = errorCountList.sort(
        (pre: ICO, next: ICO) => next.failReqTotal - pre.failReqTotal
      ).filter(({
        [key]: dimension,
      }: ICO) => (
        dimension && dimension !== '-1' && dimension !== 'undefined'
      )).slice(0, limit).map(({
        [key]: dimension,
        failReqTotal,
      }: ICO) => {
        const { reqTotal } = countList.find((item: ICO) => item[key] === dimension);
        const res: ICO = { dimension };
        res.count = reqTotal;
        res.failCount = failReqTotal;
        res.countRatio = getPctFormat(reqTotal / countTotal);
        res.failCountRatio = getPctFormat(failReqTotal / countFailTotal);
        res.failRatio = getPctFormat(failReqTotal / reqTotal);
        return res;
      });

      return this.createSuccessResponse<any>(result);
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 网络请求平均耗时按维度划分
   *
   * @param param0
   */
  @action('post', '/http/dimension/avgTime', commonParamTypes)
  async dimensionAvgTime({
    where,
    groupby = [],
    limit = 5,
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const param = {
        where,
        groupby,
        select: groupby,
      };
      const [key] = groupby;
      const [countList, timeList] = await Promise.all([
        service.queryHttpCountV2(param),
        service.queryHttpAvgTimeV2(param),
      ]);

      const countTotal = countList.reduce(
        (res: number, pre: ICO) => res + pre.reqTotal, 0
      );

      let list = countList;

      if (key === 'adCode') {
        const countMap = countList.reduce((res: ICO, city: ICO) => {
          let { adCode } = city;
          if (isAdCodeValid(adCode)) {
            const timeItem = timeList.find((item: ICO) => item[key] === adCode);
            if (timeItem) {
              const { reqTotal } = city;
              adCode = getProvinceCode(adCode);
              res[adCode] = res[adCode] || { count: 0, time: 0 };
              res[adCode].count += reqTotal;
              res[adCode].time += reqTotal * timeItem.avgTime;
            }
          }
          return res;
        }, {});

        list = Object.keys(countMap).map((k: string | number) => ({
          [key]: k,
          reqTotal: countMap[k].count,
          avgTime: countMap[k].time / countMap[k].count,
        }));
      } else {
        list = countList.map(({
          [key]: dimension,
          reqTotal,
        }: ICO) => {
          const timeItem = timeList.find((item: ICO) => item[key] === dimension);
          return {
            [key]: dimension,
            reqTotal,
            avgTime: timeItem ? timeItem.avgTime : 0,
          };
        });
      }

      const result = list.filter(({
        [key]: dimension
      }: ICO) => !!dimension).sort(
        (pre: ICO, next: ICO) => next.reqTotal - pre.reqTotal
      ).slice(0, limit).map(({
        [key]: dimension,
        reqTotal,
        avgTime,
      }: ICO) => {
        const res: ICO = { dimension };
        res.count = reqTotal;
        res.countRatio = getPctFormat(reqTotal / countTotal);
        res.avgTime = `${thousandsFmt(parseInt(avgTime, 0))}ms`;
        return res;
      });

      return this.createSuccessResponse<any>(result);
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 网络请求数差异按维度划分
   *
   * @param param0
   */
  @action('post', '/http/dimension/countCompare', commonParamTypes)
  async dimensionCountCompare({
    where,
    groupby = [],
    orderby = [],
    start = 0,
    limit = 10,
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const [key] = groupby;
      const todayParam = {
        where,
        groupby,
        select: groupby,
      };

      const yestdayParam = {
        where: {
          ...where,
          beginDate: new Date(where.beginDate.getTime() - DAY),
          endDate: new Date(where.endDate.getTime() - DAY),
        },
        groupby,
        select: groupby,
      };
      let [todayList, yestdayList] = await Promise.all([
        service.queryHttpCountV2(todayParam),
        service.queryHttpCountV2(yestdayParam),
      ]);

      if (key === 'adCode') {
        const reduceFn = (res: ICO[], pre: ICO): ICO[] => {
          let { adCode } = pre;
          if (isAdCodeValid(adCode)) {
            const { reqTotal } = pre;
            adCode = getProvinceCode(adCode);
            const matched = res.find((item: ICO) => item.adCode === adCode);
            if (matched) {
              matched.reqTotal += reqTotal;
            } else {
              res.push({
                adCode,
                reqTotal,
              });
            }
          }
          return res;
        };
        todayList = todayList.reduce(reduceFn, []);
        yestdayList = yestdayList.reduce(reduceFn, []);
      }

      let result: ICO = [];
      const cachMap: ICO = {};
      const todayCountAll = todayList.reduce((res: number, { reqTotal }: ICO) => res + reqTotal, 0);

      todayList.forEach(({ [key]: dimension, reqTotal }: ICO) => {
        cachMap[key] = 1;
        const info: ICO = {
          dimension,
          count: reqTotal,
          ratio: reqTotal / todayCountAll,
        };

        const yestday = yestdayList.find(
          (item: ICO) => item[key] === dimension,
        ) || { reqTotal: 0 };
        info.countDiff = reqTotal - yestday.reqTotal;
        info.diffRatio = getCompareRatio(reqTotal, yestday.reqTotal);
        result.push(info);
      });

      yestdayList.forEach(({ [key]: dimension, reqTotal }: ICO) => {
        if (cachMap[key]) return;
        const info: ICO = {
          dimension,
          count: 0,
          ratio: 0,
        };

        info.countDiff = 0 - reqTotal;
        info.diffRatio = getCompareRatio(0, reqTotal);
        result.push(info);
      });

      //
      const ascSort = (k: string): any => (pre: ICO, next: ICO): number => pre[k] - next[k];
      const descSort = (k: string): any => (pre: ICO, next: ICO): number => next[k] - pre[k];
      if (orderby.length) {
        const [[orderKey, dir]] = orderby;
        const sortFn = dir === 'asc' ? ascSort(orderKey) : descSort(orderKey);
        result = result.sort(sortFn);
      } else {
        result = result.sort(ascSort('countDiff'));
      }

      return this.createSuccessResponse<any>({
        data: result.map((item: ICO) => ({
          ...item,
          originCount: item.count,
          count: thousandsFmt(item.count),
          ratio: getPctFormat(item.ratio),
          diffRatio: getTrendText(Number(getPctFormat(item.diffRatio, false)), '%'),
        })).splice(start, limit),
        total: result.length,
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 网络慢请求列表
   *
   * @param param0
   */
  @action('post', '/http/slowRequest/list', commonParamTypes)
  async slowRequestList({
    where,
    groupby = [],
    orderby = [],
    start = 0,
    limit = 10,
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const [data, total] = await Promise.all([
        service.queryHttpSlowRequestList({
          select: groupby,
          where,
          offset: start,
          limit,
          groupby,
          orderby,
        }),
        service.queryHttpSlowRequestCount({
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
   * 网络请求按httpResponseCode分组
   *
   * @param param0
   */
  @action('post', '/http/dimension/httpResponseCode', commonParamTypes)
  async httpResponseCodeList({
    where,
    start = 0,
    limit = 10,
    groupby = ['httpResponseCode'],
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      let data = await service.queryHttpCountV2({
        select: groupby,
        where,
        groupby,
      });

      data = data.filter(({ httpResponseCode }: ICO) => (
        httpResponseCode !== ''
          && httpResponseCode !== '200'
          && httpResponseCode !== 'undefined'
      ));

      const dataCount = data.reduce((res: number, pre: ICO) => res + pre.reqTotal, 0);
      return this.createSuccessResponse<any>({
        data: data.map((item: ICO) => ({
          ...item,
          count: thousandsFmt(item.reqTotal),
          value: item.reqTotal,
          dimension: item.httpResponseCode,
          ratio: getPctFormat(item.reqTotal / dataCount),
          message: getHttpCodeMessage(item.httpResponseCode),
        })).splice(start, limit),
        total: data.length,
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 网络请求按businessCode分组
   *
   * @param param0
   */
  @action('post', '/http/dimension/businessCode', commonParamTypes)
  async businessCodeList({
    where,
    start = 0,
    limit = 10,
    groupby = ['businessCode'],
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const data = await service.queryHttpCountV2({
        select: groupby.concat('any(reqErrorMessage) message'),
        where: {
          ...where,
          httpResponseCode: '200',
          businessCode: [NOT_EQ_TAG, '0'],
        },
        groupby,
      });

      const dataCount = data.reduce((res: number, pre: ICO) => res + pre.reqTotal, 0);
      return this.createSuccessResponse<any>({
        data: data.map((item: ICO) => ({
          ...item,
          count: thousandsFmt(item.reqTotal),
          value: item.reqTotal,
          dimension: item.businessCode,
          ratio: getPctFormat(item.reqTotal / dataCount),
          message: item.message,
        })).splice(start, limit),
        total: data.length,
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 网络请求详情页总览数据
   *
   * @param param0
   */
  @action('post', '/http/detail/overall', commonParamTypes)
  async detailOverall({
    where,
  }: RequestParamType): Promise<any> {
    try {
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const beforeWhere = {
        ...where,
        beginDate: new Date(where.beginDate.getTime() - DAY),
        endDate: new Date(where.endDate.getTime() - DAY),
      };
      const nowWhere = { ...where };
      const service = new DimensionService();
      const result = await Promise.all([
        beforeWhere,
        nowWhere,
      ].map((param) => {
        const {
          urlHash,
          ...otherParam
        } = param;
        const otherWhere = {
          ...otherParam,
          reqUrlHash: urlHash,
        };
        return Promise.all([
          service.queryHttpAvgTimeV2({ where: otherWhere }).then((res: ICO[]) => (res[0] || {})),
          service.queryApiCount(param),
          service.queryHttpErrorCountAndRatio({ where: otherWhere }),
          service.queryHttpSlowRequestTotal({ where: otherWhere }),
        ]).then(flattenObj);
      }));
      const [lastResult, nowResult] = result;
      const finalResult: ICO[] = Object.keys(nowResult).reduce((res: ICO[], key) => {
        const lastValue = lastResult[key];
        const nowValue = nowResult[key];
        const diffValue = nowValue - lastValue;
        const statistics: ICO = {
          desc: '日同比',
        };
        switch (key) {
          case 'avgTime':
            statistics.label = '请求成功平均耗时';
            statistics.value = nowValue ? `${thousandsFmt(parseInt(nowValue, 10))}ms` : '-';
            break;
          case 'apiCount':
            statistics.label = '请求数';
            statistics.value = nowValue !== null ? String(thousandsFmt(nowValue)) : '-';
            break;
          case 'apiErrorRatioOrigin':
            statistics.label = '请求失败率';
            statistics.value = nowValue !== null ? getPctFormat(nowValue) : '-';
            break;
          case 'slowCount':
            statistics.label = '慢请求数';
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
      return this.createSuccessResponse<any>(finalResult);
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }

  /**
   * 网络请求异常实例列表
   *
   * @param param0
   */
  @action('post', '/http/detail/originlist', commonParamTypes)
  async httpDetailOriginList({
    where,
    start = 0,
    limit = 10,
  }: RequestParamType): Promise<any> {
    try {
      const service = new DimensionService();
      where.beginDate = new Date(where.beginDate);
      where.endDate = new Date(where.endDate);
      const [tableData, [failTotal = {}], [bizFailTotal = {}]] = await Promise.all([
        service.queryHttpOriginList({
          where,
          offset: start,
          limit,
        }),
        service.queryHttpFailCountV2({ where }),
        service.queryHttpBizFailCount({ where }),
      ]);

      return this.createSuccessResponse<any>({
        data: tableData.map((data: ICO) => ({
          ...data,
          date: dayjs(+data.date).format('YYYY-MM-DD HH:mm:ss.SSS'),
          requestTime: `${thousandsFmt(data.requestTime)}ms`,
          reqContentLength: thousandsFmt(data.reqContentLength),
        })),
        total: (failTotal.failReqTotal || 0) + (bizFailTotal.failReqTotal || 0),
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }
}
