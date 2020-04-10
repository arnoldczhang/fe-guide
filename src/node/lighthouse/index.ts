import defaultConfig, { defaultChromeConfig } from './config';
import AbstractBase from './AbstractBase';

const chromeLauncher = require('chrome-launcher');
const lighthouseLauncher = require('lighthouse');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

/**
 * 快速生成lighthouse报告
 */
class Lighthouse extends AbstractBase {
  private url: string = '';

  private chrome: ICO | null = null;

  private report: ICO | null = null;

  private readonly stateMap: LHStateMap = {
    init: 0,
    launch: 1,
    launchSuccess: 2,
    lighthouse: 3,
    lighthouseSuccess: 4,
    done: 5,
  };

  public readonly hookName: LHHookName = {
    beforeLaunch: 'beforeLaunch',
    launched: 'launched',
    beforeLighthouse: 'beforeLighthouse',
    lighthoused: 'lighthoused',
    compiled: 'compiled',
  };

  protected hooks: LHHook = {
    beforeLaunch: [],
    launched: [],
    beforeLighthouse: [],
    lighthoused: [],
    compiled: [],
  };

  protected state: number = this.stateMap.init;

  private option: ICO = {
    initChromeConfig: null,
    initLighthouseConfig: null,
    hooks: {},
  };

  private chromeConfig: ICO = defaultChromeConfig;

  private config: ICO = defaultConfig;

  constructor(
    url: string,
    option?: ICO,
    config?: ICO,
  ) {
    super();
    this.url = url;
    this.option = option || this.option;
    this.config = config || this.config;
    this.init();
  }

  static geInstance(
    url: string,
    options?: ICO,
    config?: ICO,
  ): Lighthouse {
    return new Lighthouse(url, options, config);
  }

  static getJson(lhr: ICO, defaultValue?: any): string {
    return Lighthouse.getReport(lhr, 'json', defaultValue);
  }

  static getHtml(lhr: ICO, defaultValue?: any): string {
    return Lighthouse.getReport(lhr, 'html', defaultValue);
  }

  static getCsv(lhr: ICO, defaultValue?: any): string {
    return Lighthouse.getReport(lhr, 'csv', defaultValue);
  }

  static getReport(
    lhr: ICO,
    type: ReportMode,
    defaultValue?: any,
  ): string {
    try {
      return reportGenerator.generateReport(lhr, type) || defaultValue;
    } catch (err) {
      return defaultValue || '';
    }
  }

  private init(): void {
    this.initOption();
  }

  private initOption(): void {
    const {
      initChromeConfig,
      initLighthouseConfig,
    } = this.option;
    if (typeof initLighthouseConfig === 'function') {
      const config = initLighthouseConfig(this.config);
      if (config) {
        this.config = config;
      }
    }

    if (typeof initChromeConfig === 'function') {
      const chromeConfig = initChromeConfig(this.chromeConfig);
      if (chromeConfig) {
        this.chromeConfig = chromeConfig;
      }
    }
  }

  private updateState(
    state: number,
    force?: boolean,
  ): void {
    this.valid(!force && state <= this.state, `已有流水线在执行，状态为：${this.state}，
    请做异步处理，比如【await/promise.then】`);
    this.state = state;
  }

  private updateChromePort(): void {
    if (this.chrome) {
      this.valid(!this.chrome.port, 'lighthouse 缺少运行端口');
      this.chromeConfig.port = this.chrome.port;
    }
  }

  private updateUrl(url?: string): void {
    if (url) {
      this.url = url;
    }
  }

  private async runChrome(): Promise<any> {
    this.valid(!this.chromeConfig, '缺少 chrome 启动器配置');
    return chromeLauncher.launch(this.chromeConfig);
  }

  private async runLighthouse(): Promise<any> {
    this.valid(!this.chromeConfig, '缺少 chrome 启动器配置');
    this.valid(!this.config, '缺少 lighthouse 基本配置');
    return lighthouseLauncher(
      this.url,
      this.chromeConfig,
      this.config,
    ).then((result: any) => {
      this.valid(!this.chrome, '缺少 chrome 实例');
      if (this.chrome) {
        return this.chrome.kill().then(() => result);
      }
      return result;
    });
  }

  private async runTask(): Promise<this | void> {
    try {
      this.updateState(this.stateMap.launch);
      this.chrome = await this.runChrome();
      this.updateState(this.stateMap.launchSuccess);
      this.updateChromePort();
      this.updateState(this.stateMap.lighthouse);
      this.report = await this.runLighthouse();
      this.updateState(this.stateMap.lighthouseSuccess);
      return this;
    } catch (err) {
      this.updateState(this.stateMap.done);
      this.uninstall();
      return Promise.resolve();
    }
  }

  private uninstall(): void {
    this.updateState(this.stateMap.init, true);
  }

  public getJson(): string {
    return this.getLhrWithType('json');
  }

  public getHtml(): string {
    return this.getLhrWithType('html');
  }

  public getLhr(): ICO | null {
    this.valid(!this.report || !this.report.lhr, '缺少 lighthouse 实例或其运行结果');
    if (this.report && this.report.lhr) {
      return this.report.lhr;
    }
    return null;
  }

  private getLhrWithType(type: ReportMode, defaultValue?: any): string {
    this.valid(!this.report || !this.report.lhr, '缺少 lighthouse 实例或其运行结果');
    if (this.report && this.report.lhr) {
      return Lighthouse.getReport(this.report.lhr, type, defaultValue);
    }
    return defaultValue || '';
  }

  public async run(url?: string): Promise<this | void> {
    this.updateUrl(url);
    const result = await this.runTask();
    return result;
  }
}

export default Lighthouse;
