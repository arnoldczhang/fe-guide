import AbstractTable from './AbstractTable';

const tableName = 'm_sdkinit_1m';

export default class MSdkinit1m extends AbstractTable {
  private appVersion: string = 'appVersion';

  private launchCount: string = 'launchCount';

  private uvCount: string = 'uvCount';

  constructor() {
    super(tableName);
  }

  public getAppVersion(): ICalcCollection {
    return this.get(this.appVersion);
  }

  public getUvCount(): ICalcCollection {
    return this.get(this.uvCount);
  }
}
