import { connectionPromise, AppManagement } from '../utils/pg';
import AbstractService from './AbstractService';

interface CreateParams {
  appName: string,
  appCategoryId: string,
  appDescription: string,
  appPlatform: string,
  cdnConfig: string
}

interface QueryParams {
  id?: number,
  appName?: string,
  appCategoryId?: string,
  appDescription?: string,
  appPlatform?: string,
  cdnConfig?: string,
  createTime?: number,
  updateTime?: number,
  [key: string]: any
}

export default class AppManagementService extends AbstractService {
  async create(
    params: CreateParams
  ): Promise<any> {
    const {
      appName, appCategoryId, appDescription, appPlatform, cdnConfig
    } = params;

    const connection = await connectionPromise;
    const record = await connection.manager.findOne(AppManagement, {
      appName
    });
    console.log('record is ', record);

    if (record) {
      throw new Error(`${appName}项目已创建`);
    } else {
      const newRecord = new AppManagement();
      Object.assign(newRecord, {
        appName,
        appCategoryId,
        appDescription,
        appPlatform,
        cdnConfig,
        appReleased: false
      });
      console.log('save record', newRecord);
      await connection.manager.save(newRecord);
      return true;
    }
  }

  async read(queryParams: QueryParams): Promise<any[]> {
    const connection = await connectionPromise;

    const findWhere: any = {};
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined) {
        findWhere[key] = queryParams[key];
      }
    });
    console.log('findWhere', findWhere);

    const records = await connection.manager.find(
      AppManagement,
      {
        where: findWhere,
        order: {
          id: 'ASC'
        }
      }
    );

    console.log('Loaded records: ', records);

    return records;
  }

  async update(whereParams: object, updateParams: object): Promise<any> {
    const connection = await connectionPromise;
    await connection.manager.update(
      AppManagement,
      whereParams,
      updateParams
    );
    return true;
  }
}
