import AbstractTable from './AbstractTable';

const tableName = 'm_h5error_1m';

export default class MH5error1m extends AbstractTable {
  private appVersion: string = 'appVersion';

  private categoryId: string = 'categoryId';

  private pagePath: string = 'pagePath';

  private pathHash: string = 'pathHash';

  private errorType: string = 'errorType';

  private msgHash: string = 'msgHash';

  private errorMessage: string = 'errorMessage';

  private stack: string = 'stack';

  private errorCount: string = 'errorCount';

  private userCount: string = 'userCount';

  private errorPV: string = 'errorPV';

  constructor() {
    super(tableName);
  }

  public getAppVersion(): ICalcCollection {
    return this.get(this.appVersion);
  }

  public getErrorCount(): ICalcCollection {
    return this.get(this.errorCount);
  }

  public getErrorPV(): ICalcCollection {
    return this.get(this.errorPV);
  }

  public getPagePath(): ICalcCollection {
    return this.get(this.pagePath);
  }

  public getErrorMessage(): ICalcCollection {
    return this.get(this.errorMessage);
  }

  public getMsgHash(): ICalcCollection {
    return this.get(this.msgHash);
  }

  public getUserCount(): ICalcCollection {
    return this.get(this.userCount);
  }

  public getCategoryId(): ICalcCollection {
    return this.get(this.categoryId);
  }

  public getStack(): ICalcCollection {
    return this.get(this.stack);
  }
}
