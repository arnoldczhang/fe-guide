import AbstractTable from './AbstractTableV2';

const tableName = 't_log_details';

export default class MBaseInfo1m extends AbstractTable {
  private logType: string = 'logType';

  private ssid: string = 'ssid';

  private logId: string = 'logId';

  private sdkVersion: string = 'sdkVersion';

  private millisecond: string = 'millisecond';

  private deltaTime: string = 'deltaTime';

  private responseEnd: string = 'responseEnd';

  private fetchStart: string = 'fetchStart';

  private nQTotalTime: string = 'nQTotalTime';

  private isHTTPOk: string = 'isHTTPOk';

  private reqTotal: string = 'reqTotal';

  private uvCount: string = 'uvCount';

  private adCode: string = 'adCode';

  private carrier: string = 'carrier';

  private cityCode: string = 'cityCode';

  private deviceModel: string = 'deviceModel';

  private httpResponseCode: string = 'httpResponseCode';

  private networkType: string = 'networkType';

  private osInfo: string = 'osInfo';

  private reqErrorMessage: string = 'reqErrorMessage';

  private reqUrl: string = 'reqUrl';

  private reqUrlHash: string = 'reqUrlHash';

  private userGuid: string = 'userGuid';

  private reqContentLength: string = 'reqContentLength';

  private ncMethod: string = 'ncMethod';

  private ncParams: string = 'ncParams';

  private ncState: string = 'ncState';

  private ncTotalTime: string = 'ncTotalTime';

  private ncErrMsg: string = 'ncErrMsg';

  private ncErrMsgHash: string = 'ncErrMsgHash';

  private ncBizCode: string = 'ncBizCode';

  private stack: string = 'stack';

  private businessCode: string = 'businessCode';

  constructor() {
    super(tableName);
  }

  public getNQTotalTime(): ICalcCollection {
    return this.get(this.nQTotalTime);
  }

  public getReqTotal(): ICalcCollection {
    return this.get(this.reqTotal);
  }

  public getIsHTTPOk(): ICalcCollection {
    return this.get(this.isHTTPOk);
  }

  public getUvCount(): ICalcCollection {
    return this.get(this.uvCount);
  }

  public getHttpResponseCode(): ICalcCollection {
    return this.get(this.httpResponseCode);
  }

  public getResponseEnd(): ICalcCollection {
    return this.get(this.responseEnd);
  }

  public getFetchStart(): ICalcCollection {
    return this.get(this.fetchStart);
  }

  public getSsid(): ICalcCollection {
    return this.get(this.ssid);
  }

  public getReqUrlHash(): ICalcCollection {
    return this.get(this.reqUrlHash);
  }

  public getReqUrl(): ICalcCollection {
    return this.get(this.reqUrl);
  }

  public getMillisecond(): ICalcCollection {
    return this.get(this.millisecond);
  }

  public getDeltaTime(): ICalcCollection {
    return this.get(this.deltaTime);
  }

  public getUserGuid(): ICalcCollection {
    return this.get(this.userGuid);
  }

  public getReqContentLength(): ICalcCollection {
    return this.get(this.reqContentLength);
  }

  public getNetworkType(): ICalcCollection {
    return this.get(this.networkType);
  }

  public getSdkVersion(): ICalcCollection {
    return this.get(this.sdkVersion);
  }

  public getAdCode(): ICalcCollection {
    return this.get(this.adCode);
  }

  public getLogId(): ICalcCollection {
    return this.get(this.logId);
  }

  public getNcMethod(): ICalcCollection {
    return this.get(this.ncMethod);
  }

  public getNcParams(): ICalcCollection {
    return this.get(this.ncParams);
  }

  public getNcState(): ICalcCollection {
    return this.get(this.ncState);
  }

  public getNcTotalTime(): ICalcCollection {
    return this.get(this.ncTotalTime);
  }

  public getNcErrMsg(): ICalcCollection {
    return this.get(this.ncErrMsg);
  }

  public getNcErrMsgHash(): ICalcCollection {
    return this.get(this.ncErrMsgHash);
  }

  public getNcBizCode(): ICalcCollection {
    return this.get(this.ncBizCode);
  }

  public getStack(): ICalcCollection {
    return this.get(this.stack);
  }

  public getDeviceModel(): ICalcCollection {
    return this.get(this.deviceModel);
  }

  public getBusinessCode(): ICalcCollection {
    return this.get(this.businessCode);
  }

  static getFailHttp(): ICalcCollection {
    const table = new MBaseInfo1m();
    return table.getHttpResponseCode().lte('100')
      .or(table.getHttpResponseCode().gte('400'))
      .or(table.getHttpResponseCode().eq(''))
      .or(table.getHttpResponseCode().eq('undefined'))
      .or(table.getHttpResponseCode().length().lt(3))
      .group();
  }

  static getBizFailHttp(): ICalcCollection {
    const table = new MBaseInfo1m();
    return table.getHttpResponseCode().eq('200')
      .and(table.getBusinessCode().notEq('0'))
      .and(table.getBusinessCode().notEq(''))
      .group();
  }
}
