import * as sourceMap from 'source-map';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import {
  identify,
  lineRE,
  getArg,
  isSourceMap,
  isAbsFilePath,
  isFuc,
  isHttpFilePath,
  isOSSFilePath,
  isObjectString,
  isSourceMsg,
  parseSourceMsg,
  addMapSuffix,
  isMapFile,
} from './utils';

const OSS = require('ali-oss');
const env = require('../../../env.js');

const {
  keys,
} = Object;

const sourceMapStore = new OSS({
  accessKeyId: 'LTAI4G9usksb77DzwRct7RtH',
  accessKeySecret: 'mx8sWJtIew4w3wBt2lszqK9EorVywS',
  bucket: 'carfee-sourcemap',
  region: 'oss-cn-hangzhou',
  internal: env !== 'dev',
});

export default class Compiler {
  stack: string[];

  result: ICompileResult = {};

  options: ISourceOption;

  timer: number;

  retryTimes: number;

  maxTimeout: number;

  // 请求url -> Promise
  cachUrls: ICO = {};

  // 解析前文件名 -> sourceMapConsumer
  cachConsumers: ICO = {};

  // 解析后文件名 -> 单文件源码
  cachFileContent: ICO = {};

  filter: Function;

  constructor(stack: string, options: ISourceOption) {
    this.stack = stack.split(lineRE).filter(identify);
    this.options = options;
    this.timer = Date.now();
    this.filter = getArg(options, 'filter', false) as Function;
    this.retryTimes = getArg(options, 'retryTimes') as number;
    this.maxTimeout = getArg(options, 'maxTimeout') as number;
  }

  /**
   * 转sourcemap
   * @param sourcemap string sourcemap
   * @param raw Object { line, column, origin, url } stack原始信息
   */
  async sourceMapify(
    sourcemap: sourceMap.RawSourceMap,
    raw: ICO<string>,
  ): Promise<string> {
    const { url, origin } = raw;
    if (isSourceMap(sourcemap)) {
      const { file } = sourcemap;
      const cachedConsumer = this.cachConsumers[file];
      let consumer;
      if (cachedConsumer) {
        consumer = cachedConsumer;
      } else {
        consumer = new sourceMap.SourceMapConsumer(sourcemap);
        this.cachConsumers[file] = consumer;
      }

      try {
        const {
          source,
          line,
          column,
          name,
        } = (await consumer).originalPositionFor({
          line: Number(raw.line),
          column: Number(raw.column),
        });

        if (source) {
          const sourceContent = (await consumer).sourceContentFor(source);
          this.cachFileContent[source] = sourceContent;
          return `at ${name} (${source}:${line}:${column})`;
        }
      } catch (err) {
        console.log('sourcemap解析失败', err);
      }
      return origin;
    }

    if (sourcemap) {
      this.cachFileContent[url] = sourcemap;
    }
    return origin;
  }

  /**
   * destroy
   * 1. 缓存初始化
   * 2. 销毁 consumers
   */
  destroy(): void {
    keys(this.cachConsumers).forEach((key: string) => {
      try {
        this.cachConsumers[key].then((consumer: sourceMap.SourceMapConsumer) => {
          consumer.destroy();
        });
      } catch (err) {
        console.log(err);
      }
    });
    this.cachUrls = {};
    this.cachConsumers = {};
    this.cachFileContent = {};
  }

  /**
   * 获取本地资源路径的内容
   * @param url string 本地路径
   */
  async fetchLocalUrl(url: string): Promise<string> {
    try {
      const filepath = isAbsFilePath(url) ? url : path.resolve(__dirname, url);
      const content = fs.readFileSync(filepath, 'utf8');
      return content;
    } catch (err) {
      return '';
    }
  }

  /**
   * 获取sourcemap资源
   * @param url string 资源url
   * @param triedTimes number 重试次数
   */
  async fetchUrl(url: string, triedTimes = 0): Promise<string> {
    if (isFuc(this.filter) && this.filter(url)) {
      return '';
    }

    // http资源
    if (isHttpFilePath(url)) {
      return fetch(url, {
        timeout: this.maxTimeout,
      }).then((res) => (
        isMapFile(url) ? res.json() : res.text()
      )).catch(() => (
        triedTimes < this.retryTimes
          ? this.fetchUrl(url, triedTimes + 1)
          : ''
      ));
    }

    // oss资源
    if (isOSSFilePath(url)) {
      try {
        let { content } = await sourceMapStore.get(url);
        content = content.toString();
        if (isObjectString(content)) {
          return JSON.parse(content);
        }
        return content;
      } catch (err) {
        return triedTimes < this.retryTimes
          ? this.fetchUrl(url, triedTimes + 1)
          : '';
      }
    }

    // 本地资源
    return this.fetchLocalUrl(url);
  }

  /**
   * 运行sourcemap
   */
  async run(): Promise<void> {
    const cbs: Function[] = [];
    const result = await Promise.all(this.stack.map(async (msg: string) => {
      if (isSourceMsg(msg)) {
        const msgResult = parseSourceMsg(msg);
        const [origin, url, line, column] = msgResult as string[];
        const cachedUrl = this.cachUrls[url];
        cbs.push((m: sourceMap.RawSourceMap) => this.sourceMapify(m, {
          url,
          origin,
          line,
          column,
        }));
        if (cachedUrl) {
          return cachedUrl;
        }
        this.cachUrls[url] = this.fetchUrl(addMapSuffix(url as string));
        return this.cachUrls[url];
      }
      cbs.push(identify);
      return msg;
    }));

    const stack = await Promise.all(
      result.map(async (res: sourceMap.RawSourceMap, index: number) => cbs[index](res))
    );
    this.result = {
      stack,
      urls: keys(this.cachFileContent),
      urlMap: this.cachFileContent,
    };
    this.destroy();
  }

  /**
   * 获取更新的stack
   */
  getResult(): ICompileResult {
    return this.result;
  }
}
