import AbstractTable from './AbstractTable';

const tableName = 'm_h5nativex_1m';

export default class MH5nativex1m extends AbstractTable {
  private appVersion: string = 'appVersion';

  private categoryId: string = 'categoryId';

  private ncMethod: string = 'ncMethod';

  private ncState: string = 'ncState';

  private total: string = 'total';

  private avgTotalTime: string = 'avgTotalTime';

  private ncQTotalTime: string = 'ncQTotalTime';

  constructor() {
    super(tableName);
  }

  public getAppVersion(): ICalcCollection {
    return this.get(this.appVersion);
  }

  public getCategoryId(): ICalcCollection {
    return this.get(this.categoryId);
  }

  public getNcMethod(): ICalcCollection {
    return this.get(this.ncMethod);
  }

  public getNcState(): ICalcCollection {
    return this.get(this.ncState);
  }

  public getTotal(): ICalcCollection {
    return this.get(this.total);
  }

  public getAvgTotalTime(): ICalcCollection {
    return this.get(this.avgTotalTime);
  }
}
