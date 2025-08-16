import AbstractTable from './AbstractTable';

const tableName = 'm__reqTime_count_userCount__pagePath_isHttpOK_reqUrl_reqAction_1m';

export default class MReqTimeCountUserCountPagePathIsHttpOKReqUrlReqAction1m extends AbstractTable {
  private appVersion: string = 'appVersion';

  private categoryId: string = 'categoryId';

  private avgTotalTime: string = 'avgTotalTime';

  private nQTotalTime: string = 'nQTotalTime';

  private count: string = 'count';

  private userCount: string = 'userCount';

  private pagePath: string = 'pagePath';

  private pathHash: string = 'pathHash';

  private isHTTPOk: string = 'isHTTPOk';

  private reqUrl: string = 'reqUrl';

  private reqAction: string = 'reqAction';

  constructor() {
    super(tableName);
  }

  public getAppVersion(): ICalcCollection {
    return this.get(this.appVersion);
  }

  public getPagePath(): ICalcCollection {
    return this.get(this.pagePath);
  }

  public getReqUrl(): ICalcCollection {
    return this.get(this.reqUrl);
  }

  public getCount(): ICalcCollection {
    return this.get(this.count);
  }
}
