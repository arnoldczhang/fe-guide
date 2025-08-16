import { utils, write, WorkSheet } from 'xlsx';
import { AbstractController, action } from './AbstractController';
import { ErrorService } from '../service/ErrorService';
import { PageLoadService } from '../service/PageLoadService';

import dayjs = require('dayjs');

const commonParamTypes: Readonly<any> = {
  beginDate: 'date',
  endDate: 'date',
  categoryId: '?',
  errorHash: '?',
  appVersion: '?',
  pathHash: '?',
  interval: true,
  appName: '?',
};
type RequestParamType = {
  beginDate: Date;
  endDate: Date;
  categoryId?: string;
  errorHash?: number[];
  appVersion?: string[];
  pathHash?: string;
  interval: Interval;
  appName?: string;
};
export class ErrorFindController extends AbstractController {
  /**
   * 异常信息的曲线
   */
  @action('post', '/error/tendency', commonParamTypes)
  public async tendency({
    beginDate,
    endDate,
    categoryId,
    errorHash,
    pathHash,
    interval,
    appName,
  }: RequestParamType) {
    const errorSvc = new ErrorService();
    if (!errorHash || !errorHash.length) {
      errorHash = (
        await errorSvc.getTop15ErrorHash({
          beginDate,
          endDate,
          categoryId,
          pathHash,
          appName,
        })
      ).map((item) => item.errorHash);
    }

    const result = await errorSvc.getErrorDetailTendency({
      beginDate,
      endDate,
      categoryId,
      errorHash,
      pathHash,
      interval,
      appName,
    });
    return this.createSuccessResponse(result);
  }

  // 暂时保留原 GET 接口，等前端上线替换为 POST 后，可以删除此方法
  @action('get', '/error/list', commonParamTypes)
  public async errorDetailList({
    beginDate,
    endDate,
    categoryId,
    pathHash,
    appName,
  }: RequestParamType) {
    const errorSvc = new ErrorService();
    const result = await errorSvc.getErrorDetailList({
      beginDate,
      endDate,
      categoryId,
      pathHash,
      appName,
    });
    return this.createSuccessResponse(result);
  }

  @action('post', '/error/list', { ...commonParamTypes, only: '?' })
  public async postErrorDetailList({
    beginDate,
    endDate,
    categoryId,
    pathHash,
    appName,
    appVersion,
    only,
  }: RequestParamType & { only?: boolean }): Promise<any> {
    const errorSvc = new ErrorService();
    let result;
    if (only && appVersion && appVersion.length) {
      try {
        const tempResult = await errorSvc.getErrorDetailListByAppVersion({
          beginDate,
          endDate,
          categoryId,
          pathHash,
          appName,
        });

        result = tempResult.reduce((res: any[], error: {
          errorMessage: string;
          errorHash: number;
          errorCount: number;
          errorUV: number;
          appVersion: string[];
        }): any[] => {
          const {
            appVersion: version,
          } = error;

          if (version.length <= appVersion.length) {
            const contained = version.every((v: string) => appVersion.includes(v));
            if (contained) {
              res.push(error);
            }
          }
          return res;
        }, []);
      } catch (err) {
        result = await errorSvc.getErrorDetailList({
          beginDate,
          endDate,
          categoryId,
          pathHash,
          appName,
          appVersion,
        });
      }
    } else {
      result = await errorSvc.getErrorDetailList({
        beginDate,
        endDate,
        categoryId,
        pathHash,
        appName,
        appVersion,
      });
    }
    return this.createSuccessResponse(result);
  }

  @action('post', '/error/count', commonParamTypes)
  public async errorCount({
    beginDate,
    endDate,
    categoryId,
    errorHash,
    pathHash,
    appName,
  }: RequestParamType) {
    const errorSvc = new ErrorService();
    const result = await errorSvc.getErrorCount({
      beginDate,
      endDate,
      categoryId,
      errorHash,
      pathHash,
      appName,
    });
    return this.createSuccessResponse(result);
  }

  @action('post', '/error/error_pv_ratio', commonParamTypes)
  public async errorRatio({
    beginDate,
    endDate,
    categoryId,
    errorHash,
    pathHash,
    appName,
  }: RequestParamType) {
    const errorSvc = new ErrorService();
    const pageloadSvc = new PageLoadService();
    const [errorPV, pv] = await Promise.all([
      errorSvc.getErrorPV({
        beginDate,
        endDate,
        categoryId,
        errorHash,
        pathHash,
        appName,
      }),
      pageloadSvc.getPV({
        beginDate, endDate, categoryId, pathHash, appName
      }),
    ]);

    return this.createSuccessResponse(errorPV / pv);
  }

  @action('post', '/error/error_uv', commonParamTypes)
  public async errorUV({
    beginDate,
    endDate,
    categoryId,
    errorHash,
    pathHash,
    appName,
  }: RequestParamType) {
    const errorSvc = new ErrorService();
    const errorUV = await errorSvc.getErrorUV({
      beginDate,
      endDate,
      categoryId,
      errorHash,
      pathHash,
      appName,
    });
    return this.createSuccessResponse(errorUV);
  }

  /**
   * 根据不同维度聚合错误的分布情况
   * 例如：应用版本、客户端基础库版本等
   */
  @action('post', '/error/distribution', {
    ...commonParamTypes,
    dimension: true,
  })
  public async errorDistribution({
    beginDate,
    endDate,
    categoryId,
    dimension,
    errorHash,
    appName,
  }: RequestParamType & { dimension: string }) {
    const errorSvc = new ErrorService();
    const result = await errorSvc.getErrorDistribution({
      beginDate,
      endDate,
      categoryId,
      errorHash,
      appName,
      dimension: dimension as any,
    });
    return this.createSuccessResponse(result);
  }

  @action('get', '/error/download', {
    beginDate: 'date',
    endDate: 'date',
    categoryId: '?',
    appName: '?',
  })
  public async downloadErrorXLSX({
    beginDate,
    endDate,
    categoryId,
    appName,
  }: {
    beginDate: Date;
    endDate: Date;
    categoryId?: string;
    appName?: string;
  }) {
    const errorSvc = new ErrorService();
    const date = dayjs(beginDate).startOf('day').toDate();
    const data = await errorSvc.getExportedErrorList({
      beginDate: date,
      endDate: dayjs(beginDate).add(1, 'day').startOf('day').toDate(),
      categoryId,
      appName,
    });
    const result = data.map((item) => ({
      业务线Id: item.categoryId,
      影响的版本号: item.appVersions,
      pathId: item.pathHash.toString(),
      业务路径: item.pagePath,
      errorId: item.errorHash.toString(),
      异常消息: item.errorMessage,
      发生次数: item.errorCount,
      影响用户数: item.userCount,
      备注: ''
    }));
    const sheet = utils.json_to_sheet(result);
    const workbook = {
      SheetNames: [] as string[],
      Sheets: {} as { [sheet: string]: WorkSheet },
    };
    const sheetName = dayjs(date).format('YYYY-MM-DD');
    workbook.SheetNames.push(sheetName);
    workbook.Sheets[sheetName] = sheet;
    const buf = write(workbook, { type: 'buffer', bookType: 'xlsx' });
    this.ctx.set('Content-Disposition', `attachment;filename=jserror.xlsx`);
    this.ctx.body = buf;
  }
}
