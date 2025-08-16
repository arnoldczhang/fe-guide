import AbstractTable from './AbstractTableV2';

const tableName = 'm__pvCount_uvCount_whiteCount__baseInfo__1m';

export default class MPageBaseInfo1m extends AbstractTable {
  private whiteCount: string = 'whiteCount';

  private nQWhiteTime: string = 'nQWhiteTime';

  private nQFirstScreenTime: string = 'nQFirstScreenTime';

  private pvCount: string = 'pvCount';

  private uvCount: string = 'uvCount';

  private adCode: string = 'adCode';

  private carrier: string = 'carrier';

  private cityCode: string = 'cityCode';

  private deviceModel: string = 'deviceModel';

  private errorType: string = 'errorType';

  private networkType: string = 'networkType';

  private osInfo: string = 'osInfo';

  constructor() {
    super(tableName);
  }

  public getPvCount(): ICalcCollection {
    return this.get(this.pvCount);
  }

  public getUvCount(): ICalcCollection {
    return this.get(this.uvCount);
  }
}
