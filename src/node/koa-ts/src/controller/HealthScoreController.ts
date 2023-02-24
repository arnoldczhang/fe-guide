// eslint-disable-next-line no-unused-vars
import { AbstractController, action } from './AbstractController';
import {HealthScoreService} from '../service/HealthScoreService'

const commonParamTypes: Readonly<any> = {
  beginDate: 'date',
  endDate: 'date',
  pathHash: '?',
  categoryId: '?',
  appName: '?',
  groupByDay: '?',
  groupKeys: '?'
};
type RequestParamType = {
  beginDate: Date;
  endDate: Date;
  categoryId?: string;
  appName?: string;
  pathHash?: number;
  groupByDay: boolean;
  groupKeys?: GroupKey[];
};
type PathMetaType = {
  jsErrorInfo: {
    
  },
  pathHash: number,
  apiInfo: {

  },
  pvInfo: {

  }
}
type GroupKey = 'pagePath' | 'categoryId' | 'appName' | '';

function strMapToObj(strMap: any) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

// 有两种情况，按categoryId归类，或者按pagePath进行归类

export default class HealthScoreController extends AbstractController {

  @action('post', '/healthscore/applist', commonParamTypes) 
  public async applist(params: RequestParamType) : Promise<any> {
    const healthScoreSvc = new HealthScoreService();

    const result = await healthScoreSvc.getApplist(params);

    return this.createSuccessResponse(result);
  }

  @action('post', '/healthscore/infos', commonParamTypes)
  public async healthscore(params: RequestParamType) {
    const healthScoreSvc = new HealthScoreService();

    const resultMap = new Map();

    // 取前200个PV值的页面，然后拿这些页面再去获取其它的数据，现在最大的支付宝应用也就160个页面
    const pvData = await healthScoreSvc.getPV({...params, limit: 200});

    let groupKey: GroupKey = params.groupKeys ? params.groupKeys[0] : '';
    let queryParams: any = {...params};

    if (groupKey) {
      const pagePaths = pvData.map((item: any) => {
        return item[groupKey];
      });
      const inPagesSql = `${groupKey} IN ('${pagePaths.join('\',\'')}')`;
      queryParams.extraWhere = inPagesSql;
    }

    const defaultDate = `${params.beginDate}-${params.endDate}`;

    const [firstScreenData, jsErrorData, apiData, whiteScreenData] = await Promise.all([
      healthScoreSvc.getFirstScreen(queryParams),
      healthScoreSvc.getJSError(queryParams),
      healthScoreSvc.getAPI(queryParams),
      healthScoreSvc.getWhiteScreen(queryParams)
    ]);

    pvData.forEach(({...rest})=>{
      const hash = groupKey ? rest[groupKey] : 'hash';
      const data = resultMap.get(hash) || {};
      const pvInfo = data['pvInfo'] || new Map();

      // 可能不需要seprate，一周的数据呢？
      pvInfo.set(rest.day || defaultDate, rest);
      data['pvInfo'] = pvInfo;

      data['pathHash'] = rest['pathHash']
      data['pagePath'] = rest['pagePath']
      data['categoryId'] = rest['categoryId'];
      data['appName'] = rest['appName'];
      
      resultMap.set(hash, data);
    });

    firstScreenData.forEach(({...rest})=>{
      const hash = groupKey ? rest[groupKey] : 'hash';
      const data = resultMap.get(hash) || {};
      const firstScreenInfo: any =  data.firstScreenInfo || new Map();

      const dateKey = rest.day || defaultDate;
      
      firstScreenInfo.set(dateKey, firstScreenInfo.get(dateKey) || []);
      firstScreenInfo.get(dateKey || defaultDate).push(rest);
      data['firstScreenInfo'] = firstScreenInfo;

      resultMap.set(hash, data);
    });

    jsErrorData.forEach(({...rest})=>{
      const hash = groupKey ? rest[groupKey] : 'hash';
      
      const data = resultMap.get(hash) || {};
      const jsErrorInfo = data['jsErrorInfo'] || new Map();

      jsErrorInfo.set(rest.day || defaultDate, rest)

      data['jsErrorInfo'] = jsErrorInfo;

      resultMap.set(hash, data);
    });

    apiData.forEach(({...rest}) => {
      const hash = groupKey ? rest[groupKey] : 'hash';

      const data = resultMap.get(hash) || {};
      const apiInfo = data['apiInfo'] || new Map();

      apiInfo.set(rest.day || defaultDate, rest);
      data['apiInfo'] = apiInfo;
      
      resultMap.set(hash, data);
    });

    whiteScreenData.forEach(({...rest}) => {
      const hash = groupKey ? rest[groupKey] : 'hash';
      
      const data = resultMap.get(hash) || { };
      const whiteScreenInfo = data['whiteScreenInfo'] || new Map();

      whiteScreenInfo.set(rest.day || defaultDate, rest);
      data['whiteScreenInfo'] = whiteScreenInfo;

      resultMap.set(hash, data);
    });

    let pureResult = [...resultMap.values()].map((pathMeta: any)=>{
      pathMeta.apiInfo = pathMeta.apiInfo ? [...pathMeta.apiInfo.values()] : [];
      pathMeta.jsErrorInfo = pathMeta.jsErrorInfo ? [...pathMeta.jsErrorInfo.values()] : [];
      pathMeta.pvInfo = pathMeta.pvInfo ? [...pathMeta.pvInfo.values()] : []
      pathMeta.firstScreenInfo =  pathMeta.firstScreenInfo ? [...pathMeta.firstScreenInfo.values()] : []
      pathMeta.whiteScreenInfo =  pathMeta.whiteScreenInfo ? [...pathMeta.whiteScreenInfo.values()] : []
      return pathMeta;
    });

    return this.createSuccessResponse(pureResult);
  }

  @action('post', '/healthscore/pv', commonParamTypes)
  public async pv(params: RequestParamType) {
    const healthScoreSvc = new HealthScoreService();

    const resultMap = new Map();

    // 取前200个PV值的页面，然后拿这些页面再去获取其它的数据，现在最大的支付宝应用也就160个页面
    const pvData = await healthScoreSvc.getPV({...params, limit: 200});

    let groupKey: GroupKey = params.groupKeys ? params.groupKeys[0] : '';
    let queryParams: any = {...params};

    if (groupKey) {
      const pagePaths = pvData.map((item: any) => {
        return item[groupKey];
      });
      const inPagesSql = `${groupKey} IN ('${pagePaths.join('\',\'')}')`;
      queryParams.extraWhere = inPagesSql;
    }

    const defaultDate = `${params.beginDate}-${params.endDate}`;
    
    pvData.forEach(({...rest})=>{
      const hash = groupKey ? rest[groupKey] : 'hash';
      const data = resultMap.get(hash) || {};
      const pvInfo = data['pvInfo'] || new Map();

      // 可能不需要seprate，一周的数据呢？
      pvInfo.set(rest.day || defaultDate, rest);
      data['pvInfo'] = pvInfo;

      data['pathHash'] = rest['pathHash']
      data['pagePath'] = rest['pagePath']
      data['categoryId'] = rest['categoryId'];
      data['appName'] = rest['appName'];
      
      resultMap.set(hash, data);
    });

    let pureResult = [...resultMap.values()].map((pathMeta: any)=>{
      pathMeta.pvInfo = pathMeta.pvInfo ? [...pathMeta.pvInfo.values()] : []
      return pathMeta;
    });

    return this.createSuccessResponse(pureResult);
  }
}
