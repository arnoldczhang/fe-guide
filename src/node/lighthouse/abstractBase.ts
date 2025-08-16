import { identify } from '../../sourcemap/sourcemapCompiler/utils';

export default abstract class AbstractBase {
  protected state: number = 0;

  protected hooks: any;

  public readonly hookName: any;

  /**
   * 执行对应hook
   * @param hookName String 名字
   * @param args any[] 所需入参
   */
  protected runHook<T>(
    hookName: T,
    ...args: any[]
  ): any {
    this.valid(!hookName, '必须传入hookName');
    const currentHook = this.hooks[hookName];
    if (Array.isArray(currentHook) && currentHook.length) {
      let callback: Function = identify;
      let params: any[] = [];

      if (Array.isArray(args[0])) {
        [params] = args;
      } else if (typeof args[0] === 'function') {
        [callback, params = []] = args;
      } else {
        this.throw('入参异常');
      }

      this.valid(!Array.isArray(params), '必须传入hookName');

      if (params.length === 1) {
        [params] = params;
      }

      const result = currentHook.reduce((res: any, hookCb: Function): any => (
        Array.isArray(res) ? hookCb(...res) : hookCb(res)
      ), params);
      return callback(result);
    }
    return null;
  }

  /**
   * 抛异常
   * @param msg String 异常信息
   */
  protected throw(msg: string): void {
    throw new Error(msg);
  }

  /**
   * 校验&抛错
   * @param invalid any 校验式
   * @param msg string 错误信息
   */
  protected valid(invalid: any, msg: string): void {
    if (invalid) {
      this.throw(msg);
    }
  }

  /**
   * 新增对应hook
   * @param hookName String 名字
   * @param callback Function 回调
   */
  public hook<T>(
    hookName: T,
    callback: Function,
  ): this {
    if (Array.isArray(this.hooks[hookName])) {
      this.hooks[hookName].push(callback);
    }
    return this;
  }
}
