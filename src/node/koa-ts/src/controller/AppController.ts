// eslint-disable-next-line no-unused-vars
import { AbstractController, action } from './AbstractController';
import { AppService } from '../service/AppService';

const commonParamTypes: Readonly<any> = {
  beginDate: 'date',
  endDate: 'date',
  appName: true,
  categoryId: '?',
  dimension: true,
  where: '?'
};
type RequestParamType = {
  beginDate: Date;
  endDate: Date;
  appName: string;
  categoryId?: string;
  where?: string;
  dimension:
    | 'miniPlatformVersion'
    | 'sdkVersion'
    | 'concat(browser, " " , browserVersion)'
    | 'appVersion'
    | 'deviceModel'
    | 'concat(os, " ", osVersion)';
};
export default class AppController extends AbstractController {
  @action('post', '/app/uv_distribution', commonParamTypes)
  async distribution({
    beginDate,
    endDate,
    categoryId,
    appName,
    dimension,
    where
  }: RequestParamType) {
    const appSvc = new AppService();
    const data = await appSvc.getDistribution({
      beginDate,
      endDate,
      categoryId,
      appName,
      dimension,
      where
    });
    return this.createSuccessResponse(data);
  }
}
