import { AbstractController, action } from './AbstractController';
import { ErrorService } from '../service/ErrorService';
import { PageLoadService } from '../service/PageLoadService';
import { AppService } from '../service/AppService';

const commonParamTypes: Readonly<any> = {
  beginDate: 'date',
  endDate: 'date',
  categoryId: '?',
  appName: '?',
  appVersion: '?',
};

type RequestParamType = {
  beginDate: Date;
  endDate: Date;
  categoryId?: string;
  appName?: string;
  appVersion?: string[];
};

export class ErrorFixController extends AbstractController {
  /**
   * 获取页面的错误详情
   */
  @action('post', '/fix/page_detail', commonParamTypes)
  public async errorDetail({
    beginDate,
    endDate,
    categoryId,
    appName,
    appVersion,
  }: RequestParamType) {
    const errorSvc = new ErrorService();
    const pageLoadSvc = new PageLoadService();
    const [pageErrorInfo, pvInfo] = await Promise.all([
      errorSvc.getPageErrorInfo({
        beginDate,
        endDate,
        categoryId,
        appName,
        appVersion,
      }),
      pageLoadSvc.getPagePV({
        beginDate,
        endDate,
        categoryId,
        appName,
        appVersion,
      }),
    ]);
    const map = pvInfo.reduce<{ [path: string]: number }>(
      (result: any, item: any) => ({ ...result, [item.pagePath]: item.pv }),
      {},
    );
    const data = pageErrorInfo.map((item) => ({
      categoryId: item.categoryId,
      pathHash: item.pathHash,
      pagePath: item.pagePath,
      pv: map[item.pagePath],
      errorPV: map[item.pagePath] ? item.errorPV / map[item.pagePath] : 0,
      errorCount: item.errorCount,
    }));
    return this.createSuccessResponse(data);
  }

  /**
   * 获取各版本的异常情况
   */
  @action('post', '/fix/app_version_distribution', {
    appName: true,
    categoryId: '?',
  })
  public async appVersionDistribution({
    appName,
    categoryId,
  }: {
    appName: string;
    categoryId?: string;
  }) {
    const appSvc = new AppService();
    const [errorInfo, pvuvInfo] = await Promise.all([
      appSvc.getAppVersionErrorInfo({ appName, categoryId }),
      appSvc.getAppVersionPVUV({ appName, categoryId }),
    ]);
    const map = pvuvInfo.reduce(
      (result, item) => ({
        ...result,
        [item.version]: { pv: item.pv, uv: item.uv },
      }),
      {} as { [version: string]: { pv: number; uv: number } },
    );
    const data = errorInfo
      .map((item) => ({
        version: item.version,
        errorCount: item.errorCount,
        errorPVRatio:
          map[item.version] && map[item.version].pv
            ? item.errorPV / map[item.version].pv
            : 0,
        errorUV: item.errorUV,
        errorPV: item.errorPV,
        pv: map[item.version] && map[item.version].pv,
        uv: map[item.version] && map[item.version].uv,
      }))
      .sort((item1, item2) => (item1.version > item2.version ? 1 : -1));
    return this.createSuccessResponse(data);
  }
}
