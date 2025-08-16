import AbstractTable from './AbstractTable';

const tableName = 'm_h5pageloadx_1m';

export default class MH5pageloadx1m extends AbstractTable {
  private appVersion: string = 'appVersion';

  private appType: string = 'appType';

  private categoryId: string = 'categoryId';

  private pagePath: string = 'pagePath';

  private pathHash: string = 'pathHash';

  private pvCount: string = 'pvCount';

  private uvCount: string = 'uvCount';

  private whiteCount: string = 'whiteCount';

  private avgWhiteTime: string = 'avgWhiteTime';

  private nQWhiteTime: string = 'nQWhiteTime';

  private avgFirstScreenTime: string = 'avgFirstScreenTime';

  private nQFirstScreenTime: string = 'nQFirstScreenTime';

  constructor() {
    super(tableName);
  }

  public getAppVersion(): ICalcCollection {
    return this.get(this.appVersion);
  }

  public getCategoryId(): ICalcCollection {
    return this.get(this.categoryId);
  }

  public getPvCount(): ICalcCollection {
    return this.get(this.pvCount);
  }

  public getPagePath(): ICalcCollection {
    return this.get(this.pagePath);
  }

  public getWhiteCount(): ICalcCollection {
    return this.get(this.whiteCount);
  }
}
