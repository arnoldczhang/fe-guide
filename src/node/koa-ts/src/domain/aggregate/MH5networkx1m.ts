import AbstractTable from './AbstractTable';

const tableName = 'm_h5networkx_1m';

export default class MH5networkx1m extends AbstractTable {
  private appVersion: string = 'appVersion';

  private categoryId: string = 'categoryId';

  private reqUrl: string = 'reqUrl';

  private urlHash: string = 'urlHash';

  private action: string = 'action';

  private isHTTPOk: string = 'isHTTPOk';

  private total: string = 'total';

  private userCount: string = 'userCount';

  private avgTotalTime: string = 'avgTotalTime';

  private nQTotalTime: string = 'nQTotalTime';

  constructor() {
    super(tableName);
  }

  public getAppVersion(): ICalcCollection {
    return this.get(this.appVersion);
  }

  public getCategoryId(): ICalcCollection {
    return this.get(this.categoryId);
  }

  public getReqUrl(): ICalcCollection {
    return this.get(this.reqUrl);
  }

  public getUrlHash(): ICalcCollection {
    return this.get(this.urlHash);
  }

  public getAction(): ICalcCollection {
    return this.get(this.action);
  }

  public getIsHTTPOK(): ICalcCollection {
    return this.get(this.isHTTPOk);
  }

  public getTotal(): ICalcCollection {
    return this.get(this.total);
  }

  public getUserCount(): ICalcCollection {
    return this.get(this.userCount);
  }

  public getAvgTotalTime(): ICalcCollection {
    return this.get(this.avgTotalTime);
  }

  public getNQTotalTime(): ICalcCollection {
    return this.get(this.nQTotalTime);
  }
}
