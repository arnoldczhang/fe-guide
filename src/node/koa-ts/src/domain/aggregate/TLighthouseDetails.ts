import AbstractTable from './AbstractTable';

const tableName = 't_lighthouse_details';

export default class TLighthouseDetails extends AbstractTable {
  private categoryId: string = 'categoryId';

  private userAgent: string = 'userAgent';

  private environment: string = 'environment';

  private lighthouseVersion: string = 'lighthouseVersion';

  private fetchTime: string = 'fetchTime';

  private requestedUrl: string = 'requestedUrl';

  private finalUrl: string = 'finalUrl';

  private runWarnings: string = 'runWarnings';

  private runtimeError: string = 'runtimeError';

  private audits: string = 'audits';

  private configSettings: string = 'configSettings';

  private categories: string = 'categories';

  private categoryGroups: string = 'categoryGroups';

  private timing: string = 'timing';

  private i18n: string = 'i18n';

  private stackPacks: string = 'stackPacks';

  private jobId: string = 'jobId';

  private taskId: string = 'taskId';

  private score: string = 'score';

  private startTimestamp: string = 'startTimestamp';

  private endTimestamp: string = 'endTimestamp';

  private millisecond: string = 'millisecond';

  private pagePath: string = 'pagePath';

  private pv: string = 'pv';

  private status: string = 'status';

  constructor() {
    super(tableName);
  }

  public getCategoryId(): ICalcCollection {
    return this.get(this.categoryId);
  }
}
