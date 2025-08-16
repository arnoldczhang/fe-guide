import { AbstractController, action } from './AbstractController';
import MinicodeBuildService from '../service/MinicodeBuildService';
import config from '../config';

type createParams = {
  giturl: string;
  appName: string;
  callbackUrl: string;
  commitId: string;
  branch: string;
}
const createParamsTypes: Readonly<any> = {
  giturl: 'string',
  appName: 'string',
  callbackUrl: 'string',
  commitId: 'string',
  branch: 'string'
};

type queryParams = {
  appName: string,
  limit: number,
  extraCommitId: string
}
const queryParamsTypes: Readonly<any> = {
  appName: 'string',
  limit: 'number',
  extraCommitId: 'string'
};

type updateParams = {
  appName: string;
  commitId: string;
  status: number;
  result: string;
  version: string;
}
const updateParamsTypes: Readonly<any> = {
  appName: 'string',
  commitId: 'string',
  status: 'number',
  result: 'string',
  version: 'string'
};

type getLatest = {
  appName: string;
}
const getLatestParamsTypes: Readonly<any> = {
  appName: 'string',
};

export default class MinicodeBuildController extends AbstractController {
  @action('post', '/minicodeBuild/create', createParamsTypes)
  public async createBuild(params: createParams): Promise<any> {
    const service = new MinicodeBuildService();

    const record = await service.getOneByCommitId(params);
    if(record) {
      // 是否要调用callbackUrl呢？
      return this.createSuccessResponse({message: '已经存在了'});
    }
    
    const result = await service.create(params);

    const jenkins = require('jenkins')({
      baseUrl: config.jenkinsUrl,
      crumbIssuer: false
    });

    jenkins.job.config('AppBaseAliMP_test', (err: any, data: any) => {
      if (err) throw err;
    });

    jenkins.job.build({
      name: 'AppBaseAliMP_test',
      parameters: {
        ...params
      }
    }, (err: any, data: any) => {
      // 失败时需要再重新运行，基本再来一次肯定够了
      if (err) throw err;

      console.log('queue item number', data);
    });

    if (result instanceof Error) {
      return this.createErrorResponse(result.message);
    }

    return this.createSuccessResponse({});
  }

  @action('post', '/minicodeBuild/update', updateParamsTypes)
  public async updateBuild(params: updateParams): Promise<any> {
    const service = new MinicodeBuildService();
    const result = await service.update(params);
    if (result instanceof Error) {
      return this.createErrorResponse(result.message);
    }

    return this.createSuccessResponse({});
  }

  @action('post', '/minicodeBuild/query', queryParamsTypes)
  public async queryBuild(params: queryParams): Promise<any> {
    const service = new MinicodeBuildService();
    const result = await service.queryRecords(params);
    if (result instanceof Error) {
      return this.createErrorResponse(result.message);
    }
    result.forEach((meta: any) => {
      meta.result = JSON.parse(meta.result || '{}');
    });

    return this.createSuccessResponse(result);
  }

  @action('post', '/minicodeBuild/getLatestStats', getLatestParamsTypes)
  public async getLatestStats(params: getLatest): Promise<any> {
    const service = new MinicodeBuildService();
    const result = await service.getLatestStats(params);
    if (result instanceof Error) {
      return this.createErrorResponse(result.message);
    }

    return this.createSuccessResponse(result);
  }

  @action('post', '/minicodeBuild/getLatestUseless', getLatestParamsTypes)
  public async getUselessComponents(params: getLatest): Promise<any> {
    const service = new MinicodeBuildService();
    const result = await service.getUselessComponents(params);
    if (result instanceof Error) {
      return this.createErrorResponse(result.message);
    }

    return this.createSuccessResponse(result);
  }
}
