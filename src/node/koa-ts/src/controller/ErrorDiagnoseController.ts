import { AbstractController, action } from './AbstractController';
import { ErrorService } from '../service/ErrorService';

const commonParamTypes: Readonly<any> = {
  beginDate: 'date',
  endDate: 'date',
  errorHash: true,
  pathHash: '?',
  appName: '?',
  categoryId: '?',
};
const paginationParamTypes = {
  start: true as true,
  limit: true as true,
};
type RequestParamType = {
  beginDate: Date;
  endDate: Date;
  errorHash: number;
  pathHash?: number;
  appName?: string;
  categoryId?: string;
};
type PaginationParamType = {
  start: number;
  limit: number;
};
export class ErrorDiagnoseController extends AbstractController {
  /**
   * 获取错误信息的详情
   */
  @action('post', '/diagnose/error/detail', commonParamTypes)
  public async errorDetail({
    beginDate,
    endDate,
    errorHash,
    pathHash,
    appName
  }: RequestParamType) {
    const service = new ErrorService();
    const data = await service.getSepecifiedErrorDetail({
      beginDate,
      endDate,
      errorHash,
      pathHash,
      appName
    });
    return this.createSuccessResponse(data);
  }

  /**
   * 获取错误用户分布列表
   */
  @action('post', '/diagnose/error_uv', {
    ...commonParamTypes,
    ...paginationParamTypes,
  })
  public async errorUV({
    beginDate,
    endDate,
    errorHash,
    appName,
    categoryId,
    start,
    limit,
  }: RequestParamType & PaginationParamType) {
    const service = new ErrorService();
    const data = await service.getErrorUVDetail({
      beginDate,
      endDate,
      errorHash,
      appName,
      categoryId,
      start,
      limit,
    });
    return this.createSuccessResponse(data);
  }

  /**
   * 获取错误列表
   */
  @action('post', '/diagnose/error_list', {
    ...commonParamTypes,
    ...paginationParamTypes,
  })
  public async errorList({
    beginDate,
    endDate,
    errorHash,
    appName,
    categoryId,
    start,
    limit,
  }: RequestParamType & PaginationParamType) {
    const service = new ErrorService();
    const data = await service.getSpecifiedErrorList({
      beginDate,
      endDate,
      errorHash,
      appName,
      categoryId,
      start,
      limit,
    });
    return this.createSuccessResponse(data);
  }
}
