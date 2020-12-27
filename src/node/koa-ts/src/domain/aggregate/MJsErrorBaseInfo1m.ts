import AbstractTable from './AbstractTableV2';

const tableName = 'm__jsErrorCount_errorPvCount_errorUvCount__baseInfo_errorType_msgHash__1m';

export default class MJsErrorBaseInfo1m extends AbstractTable {
  private jsErrorCount: string = 'jsErrorCount';

  private errorPvCount: string = 'errorPvCount';

  private errorUvCount: string = 'errorUvCount';

  private errorMessage: string = 'errorMessage';

  private stack: string = 'stack';

  private adCode: string = 'adCode';

  private carrier: string = 'carrier';

  private cityCode: string = 'cityCode';

  private deviceModel: string = 'deviceModel';

  private errorType: string = 'errorType';

  private msgHash: string = 'msgHash';

  private networkType: string = 'networkType';

  private osInfo: string = 'osInfo';

  private sdkVersion: string = 'sdkVersion';

  constructor() {
    super(tableName);
  }

  public getErrorMessage(): ICalcCollection {
    return this.get(this.errorMessage);
  }

  public getMsgHash(): ICalcCollection {
    return this.get(this.msgHash);
  }

  public getJsErrorCount(): ICalcCollection {
    return this.get(this.jsErrorCount);
  }

  public getErrorPvCount(): ICalcCollection {
    return this.get(this.errorPvCount);
  }

  public getErrorUvCount(): ICalcCollection {
    return this.get(this.errorUvCount);
  }
}
