import { AbstractController, action } from './AbstractController';
import LighthouseService from '../service/LighthouseService';

const lhCommonParamTypes: Readonly<any> = {
  select: '?',
  where: '?',
  groupby: '?',
  orderby: '?',
  limit: '?',
  output: '?',
};

export default class LighthouseController extends AbstractController {
  @action('post', '/lighthouse/save', { params: true })
  public async saveSingleLhr({
    params,
  }: ICO): Promise<any> {
    const service = new LighthouseService();
    const result = await service.insertSingleLhrPg(params);
    if (result instanceof Error) {
      return this.createErrorResponse(result.message);
    }
    return this.createSuccessResponse(result);
  }

  @action('post', '/lighthouse/query', lhCommonParamTypes)
  public async queryLhr({ output = 'json', ...restParams }: SqlCommonParam & {output: 'json' | 'html', select: any[]}): Promise<any> {
    const service = new LighthouseService();
    const result = await service.queryAnyLhrPg(restParams);
    if (result instanceof Error) {
      return this.createErrorResponse(result.message);
    }
    if (output === 'html') {
      const htmlResult = {
        html: service.generateReportHtml({}),
        lhData: result[0]
      };
      return this.createSuccessResponse((htmlResult));
    }

    return this.createSuccessResponse(result);
  }
}
