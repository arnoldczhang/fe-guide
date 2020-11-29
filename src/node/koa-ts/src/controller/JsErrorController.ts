import { AbstractController, action } from './AbstractController';
import DimensionService from '../service/DimensionService';
import { flattenObj, getPctFormat } from '../utils/helper';

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

const getTrend = (value: number): number => {
  let trend;
  if (value > 0) {
    trend = 0;
  } else if (value < 0) {
    trend = 1;
  } else {
    trend = 2;
  }
  return trend;
};

export default class JsErrorController extends AbstractController {
  /**
   * js异常页总览数据（TODO）
   *
   * @param param0
   */
  @action('post', '/jserror/overall', commonParamTypes)
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
      ].map((param) => Promise.all([
        service.queryJsErrorPVV2(param),
        service.queryJsErrorCountV2(param),
        service.queryJsErrorUVV2(param),
        service.queryPVV2(param),
        service.queryUVV2(param),
      ]).then(flattenObj)));

      const [lastResult, nowResult] = result;
      const finalResult: ICO[] = Object.keys(nowResult).reduce((res: ICO[], key) => {
        let lastValue = lastResult[key];
        let nowValue = nowResult[key];
        let diffValue = nowValue - lastValue;
        const statistics: ICO = {
          desc: '相比前24小时',
        };
        switch (key) {
          case 'jsErrorCount':
            statistics.label = '异常数';
            statistics.value = nowValue;
            statistics.trend = getTrend(diffValue);
            statistics.variety = diffValue > 0 ? `+${diffValue}` : diffValue;
            break;
          case 'jsErrorPV':
            lastValue = lastResult.pvCount ? lastValue / lastResult.pvCount : 0;
            nowValue = nowResult.pvCount ? nowValue / nowResult.pvCount : 0;
            diffValue = nowValue - lastValue;
            statistics.label = '异常率';
            statistics.value = getPctFormat(nowValue);
            statistics.trend = getTrend(diffValue);
            break;
          case 'jsErrorUV':
            break;
          default:
            break;
        }
        res.push(statistics);
        return res;
      }, []);

      return this.createSuccessResponse<any>({
        data: finalResult,
      });
    } catch ({ message, stack }) {
      return this.createFailResponse(`${message}\n${stack}`);
    }
  }
}
