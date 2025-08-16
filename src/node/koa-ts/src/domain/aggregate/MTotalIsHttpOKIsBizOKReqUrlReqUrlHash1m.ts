import AbstractTable from './AbstractTableV2';

const tableName = 'm__total__isHttpOK_isBizOK_reqUrl_reqUrlHash_1m';

export default class MTotalIsHttpOKIsBizOKReqUrlReqUrlHash1m extends AbstractTable {
  private isHTTPOk: string = 'isHTTPOk';

  private isBizOK: string = 'isBizOK';

  private reqUrl: string = 'reqUrl';

  private reqUrlHash: string = 'reqUrlHash';

  private total: string = 'total';

  constructor() {
    super(tableName);
  }

  public getIsHTTPOk(): ICalcCollection {
    return this.get(this.isHTTPOk);
  }

  public getIsBizOk(): ICalcCollection {
    return this.get(this.isBizOK);
  }

  public getReqUrlHash(): ICalcCollection {
    return this.get(this.reqUrlHash);
  }

  public getReqUrl(): ICalcCollection {
    return this.get(this.reqUrl);
  }

  public getTotal(): ICalcCollection {
    return this.get(this.total);
  }
}
