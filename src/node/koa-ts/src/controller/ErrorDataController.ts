import { AbstractController, action } from './AbstractController';
import Service from '../service/DimensionService';

const commonParamTypes: Readonly<any> = {
  beginDate: 'date',
  endDate: 'date',
  categoryId: '?',
  errorHash: '?',
  msgHash: '?',
  appVersion: '?',
  pathHash: '?',
  appName: '?',
};
type RequestParamType = {
  beginDate: Date;
  endDate: Date;
  categoryId?: string;
  errorHash?: number[];
  msgHash?: number[];
  appVersion?: string[];
  pathHash?: number;
  appName?: string;
};

const parseParam = (param: RequestParamType): void => {
  if (typeof param.pathHash === 'string') {
    param.pathHash = Number(param.pathHash);
  }

  if (
    param.errorHash
      && Array.isArray(param.errorHash)
      && param.errorHash.length
  ) {
    param.msgHash = [];
    param.errorHash.forEach((val: any, index: number) => {
      if (param.msgHash) {
        param.msgHash[index] = Number(val);
      }
    });
  }
  delete param.errorHash;
};

export default class ErrorDataController extends AbstractController {
  @action('post', '/new/error/count', commonParamTypes)
  public async errorCount(param: RequestParamType): Promise<any> {
    try {
      const serviec = new Service();
      parseParam(param);
      const result = await serviec.queryJsErrorCount(param);
      return this.createSuccessResponse(result.jsErrorCount);
    } catch (err) {
      return this.createSuccessResponse(0);
    }
  }

  @action('post', '/new/error/error_pv_ratio', commonParamTypes)
  public async errorPvRatio(param: RequestParamType): Promise<any> {
    try {
      const serviec = new Service();
      parseParam(param);
      const {
        msgHash,
        errorHash,
        ...other
      } = param;
      const result = await serviec.queryJsErrorRatio(param, { percent: false, extraWhere: other });
      return this.createSuccessResponse(result.jsErrorRatio);
    } catch (err) {
      return this.createSuccessResponse(0);
    }
  }

  @action('post', '/new/error/error_uv', commonParamTypes)
  public async errorUv(param: RequestParamType): Promise<any> {
    try {
      const serviec = new Service();
      parseParam(param);
      const result = await serviec.queryJsErrorCount(param);
      return this.createSuccessResponse(result.jsErrorCountUV);
    } catch (err) {
      return this.createSuccessResponse(0);
    }
  }
}
