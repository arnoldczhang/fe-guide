// eslint-disable-next-line no-unused-vars
import { AbstractController, action } from './AbstractController';
import { APIService } from '../service/APIService';

const commonParamTypes: Readonly<any> = {
  beginDate: 'date',
  endDate: 'date',
  appName: true,
  categoryId: '?',
};
type RequestParamType = {
  beginDate: Date;
  endDate: Date;
  appName: string;
  categoryId?: string;
};
type Dimension =
  | 'miniPlatformVersion'
  | 'httpResponseCode'
  | 'sdkVersion'
  | 'appVersion'
  | 'carrier'
  | 'concat(browser, " ", browserVersion)';

export default class APIController extends AbstractController {
  @action('post', '/api/error_distribution', {
    ...commonParamTypes,
    dimension: true,
    urlHash: true,
  })
  async distribution({
    beginDate,
    endDate,
    categoryId,
    appName,
    dimension,
    urlHash,
  }: RequestParamType & { dimension: Dimension, urlHash?: number[] }) {
    const apiSvc = new APIService();
    const data = await apiSvc.getAPIErrorDimension({
      beginDate,
      endDate,
      categoryId,
      appName,
      dimension,
      urlHash,
    });
    return this.createSuccessResponse(data);
  }

  @action('post', '/api/error_tendency', {
    ...commonParamTypes,
    interval: true,
  })
  async errorTendency({
    beginDate,
    endDate,
    categoryId,
    appName,
    interval,
  }: RequestParamType & { interval: Interval }) {
    const apiSvc = new APIService();
    const topUrlActions = await apiSvc.getTopNSlowAPI({
      beginDate,
      endDate,
      categoryId,
      appName,
    });

    const data = await apiSvc.getAPITendency({
      beginDate,
      endDate,
      categoryId,
      appName,
      interval,
      urlHashActions: topUrlActions.map(item => item.urlHash + item.action),
    });
    return this.createSuccessResponse(data);
  }
}
