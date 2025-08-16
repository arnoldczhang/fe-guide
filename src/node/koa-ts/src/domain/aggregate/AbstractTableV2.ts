import AbstractTable from './AbstractTable';

export default class AbstractTableV2 extends AbstractTable {
  private appVersion: string = 'appVersion';

  private categoryId: string = 'categoryId';

  private pagePath: string = 'pagePath';

  private pathHash: string = 'pathHash';

  public getAppVersion(): ICalcCollection {
    return this.get(this.appVersion);
  }

  public getCategoryId(): ICalcCollection {
    return this.get(this.categoryId);
  }

  public getPagePath(): ICalcCollection {
    return this.get(this.pagePath);
  }

  public getPathHash(): ICalcCollection {
    return this.get(this.pathHash);
  }
}
