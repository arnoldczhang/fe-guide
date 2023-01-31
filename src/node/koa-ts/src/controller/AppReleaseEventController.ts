import { AppReleaseEventService } from '../service/AppReleaseEventService';
import { AbstractController, action } from './AbstractController';

interface NotifyParams {
  source: string,
  operation: string,
  operator?: string,
  'resource_name': string,
  'resource_type': string,
  title?: string,
  link?: string,
  timestamp?: string
}

const notifyParamsTypes: Readonly<any> = {
  source: 'string',
  operation: 'string',
  operator: '?',
  resource_name: 'string',
  resource_type: 'string',
  title: '?',
  link: '?',
  timestamp: '?'
};

export default class AppReleaseEventController extends AbstractController {
  @action('post', '/appRealeaseEvent/notify', notifyParamsTypes)
  public async onAppRelease(params: NotifyParams): Promise<any> {
    const service = new AppReleaseEventService();
    service.notifyAppFirstTimeMoniteredOnProEnv(params);

    return this.createSuccessResponse({});
  }
}
