import soa = require('@hb/node-soa');
import AbstractService from './AbstractService';
const env: string = require('../../env.js');

export class SOAService extends AbstractService {
  private static soaInitPromise?: Promise<any>;
  constructor() {
    super();
    this.init();
  }

  private init() {
    if (!SOAService.soaInitPromise) {
      SOAService.soaInitPromise = soa.init({
        env: env as any,
        dep: [
          'EasybikeUserService',
          'AppHellobikeUserPlatformService',
        ],
        appid: 'AppFeAPMService',
        tag: env as any,
      });
    }
  }

  protected async request(params: RequestParams): Promise<ResponseData> {
    await SOAService.soaInitPromise;
    return soa.request(params)
  }
}

type RequestParams = {
  /**
   * 请求接口, 请求Java Go服务必填
   */
  iface?: string;
  /**
   * 调用远程方法
   */
  method: string;
  /**
   * 调用的服务
   */
  service: string;
  /**
   * 调用参数
   */
  data?: any[];
  /**
   * 调用服务对应的路由tag
   */
  tag?: string;
  /**
   * 调用服务对应秘钥
   */
  secretKey?: string;
}

type ResponseData = {
  /**
   * 响应码, 0成功, 其他失败
   */
  code: number,
  /**
   * 响应消息, 成功或错误信息
   */
  msg?: string,
  /**
   * 响应数据, 通常为json字符串
   */
  resultJson?: string
}
