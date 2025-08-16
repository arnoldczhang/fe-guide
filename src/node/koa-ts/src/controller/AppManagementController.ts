import AppManagementService from '../service/AppManagementService';
import { uploadDefaultCdnConfig } from '../service/UploadCdnConfigService';
import { AbstractController, action } from './AbstractController';

interface CreateParams {
  appName: string,
  appCategoryId: string,
  appDescription: string,
  appPlatform: string,
}

interface QueryParams {
  id?: number,
  appName?: string,
  appCategoryId?: string,
  appDescription?: string,
  appPlatform?: string,
  cdnConfig?: string,
  createTime?: number,
  updateTime?: number
}

const createParamsTypes: Readonly<any> = {
  appName: 'string',
  appCategoryId: 'string',
  appDescription: 'string',
  appPlatform: 'string',
};

const queryParamsTypes: Readonly<any> = {
  id: '?',
  appName: '?',
  appCategoryId: '?',
  appDescription: '?',
  appPlatform: '?',
  cdnConfig: '?',
  createTime: '?',
  updateTime: '?'
};

export default class AppManagementController extends AbstractController {
  @action('post', '/appManagement/create', createParamsTypes)
  public async createAppEntry(params: CreateParams): Promise<any> {
    const {
      appName, appCategoryId, appDescription, appPlatform
    } = params;
    const cdnConfig = await uploadDefaultCdnConfig(appName);

    const service = new AppManagementService();
    await service.create({
      appName,
      appCategoryId,
      appDescription,
      appPlatform,
      cdnConfig
    });

    return this.createSuccessResponse({});
  }

  @action('post', '/appManagement/query', queryParamsTypes)
  public async queryAppList(queryParams: QueryParams): Promise<any> {
    const service = new AppManagementService();
    const appList = await service.read(queryParams);
    return this.createSuccessResponse({
      appList
    });
  }
}
