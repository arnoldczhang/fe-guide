// 手动运行job，即通过api及时添加一些job
const Queue = require('bull');

import { AbstractController, action } from './AbstractController';
import { getRedisOptions, getOneDayInterval } from '../utils/helper';
import config from '../config';
import { getSuffix } from '../job';

type createParams = {
  cron: string;
}
const createParamsTypes: Readonly<any> = {
  cron: 'string',
};

export default class JobController extends AbstractController {
  // job/add?cron=lighthouse|dailyreport
  @action('post', '/job/add', createParamsTypes)
  public async addJob(params: createParams): Promise<any> {
    const { cron } = params;
    const redisOptions = await getRedisOptions(config);

    const suffix = getSuffix();

    const lighthouseCron = new Queue(`TimingLighthouseCron${suffix}`, {redis: redisOptions});
    const dailyReportCron = new Queue(`TimingDailyReportCron${suffix}`, {redis: redisOptions});

    const cronQueue = cron === 'lighthouse' ? lighthouseCron : dailyReportCron;

    cronQueue.add({type: 'api call'});

    return this.createSuccessResponse({});
  }
}
