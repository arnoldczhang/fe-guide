
import { identify } from '../../sourcemap/sourcemapCompiler/utils';

/**
 * 模拟流水线
 *
 * **步骤如下**
 *
 * - 配置入参
 * - 数据装配
 * - 编译&输出装配结果
 *
 */
export default abstract class AbstractPipeLineService {
  private state: PipeLineState = 'init';

  private assembleFn: Array<[ICO, Function]> = [];

  private compiler: PipeLineCompiler = {};

  private params: ICO = {};

  private hooks: Hook = {
    ParamReceived: [],
    beforeParamReceive: [],
    beforeAssemble: [],
    assembled: [],
    assembleFailed: [],
    beforeEachAssemble: [],
    eachAssembled: [],
    eachAssembleFailed: [],
    compiled: [],
  };

  protected hookName: HookName = {
    beforeParamReceive: 'beforeParamReceive',
    ParamReceived: 'ParamReceived',
    beforeAssemble: 'beforeAssemble',
    assembled: 'assembled',
    assembleFailed: 'assembleFailed',
    beforeEachAssemble: 'beforeEachAssemble',
    eachAssembled: 'eachAssembled',
    eachAssembleFailed: 'eachAssembleFailed',
    compiled: 'compiled',
  };

  /**
   * 新增对应hook
   * @param hookName String 名字
   * @param callback Function 回调
   */
  protected hook(hookName: HookNameType, callback: Function): this {
    this.hooks[hookName].push(callback);
    return this;
  }

  /**
   * 执行对应hook
   * @param hookName String 名字
   * @param args any[] 所需入参
   */
  protected runHook(
    hookName: HookNameType,
    ...args: any[]
  ): any {
    if (!hookName) {
      this.throw('必须传入hookName');
    }

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

      if (!Array.isArray(params)) {
        this.throw('runHook - 参数当为数组形式');
      }

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
   * 更新入参
   * @param params Object 入参值
   */
  protected param(params: ICO | ICO[]): this {
    if (!params) {
      this.throw('入参异常');
    }

    this.runHook(this.hookName.beforeParamReceive, [params]);
    this.params = params;
    this.runHook(this.hookName.ParamReceived, (returnValue: ICO | void) => {
      if (returnValue && typeof returnValue === 'object') {
        this.params = returnValue;
      }
    }, [this.params]);
    return this;
  }

  /**
   * 循环准备装配方法（根据`this.params`遍历）
   * @param args Funciton[] 待执行的装配方法
   */
  protected repeatSyncAssemble(...args: Function[]): this {
    if (!this.params) {
      this.throw('缺少入参');
    }

    if (!Array.isArray(this.params)) {
      this.throw('params必须是数组类型，否则请调用`syncAssemble`');
    }

    this.prepareSyncAssembleFn(true, ...args);
    return this;
  }

  /**
   * 准备装配方法
   * @param repeat Boolean 是否需要循环遍历 `this.params`
   * @param args Function[] 装配方法
   */
  protected prepareSyncAssembleFn(repeat: boolean, ...args: Function[]): this {
    async function assemble(this: any, param: ICO): Promise<any[]> {
      const output: any[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const promiseFn of args) {
        this.runHook(this.hookName.beforeEachAssemble, [promiseFn]);
        try {
          // eslint-disable-next-line no-await-in-loop
          const data = await promiseFn(param);
          this.runHook(this.hookName.eachAssembled, [promiseFn, param, data]);
          output.push(data);
        } catch (err) {
          this.runHook(this.hookName.eachAssembleFailed, [param, err]);
        }
      }
      return output;
    }

    if (repeat) {
      this.params.forEach((param: ICO) => this.assembleFn.push([param, assemble.bind(this)]));
    } else {
      this.assembleFn.push([this.params, assemble.bind(this)]);
    }
    this.updateState('sync');
    return this;
  }

  /**
   * 数据装配
   * @param resolver Object 通用返回值处理（cb、fb）
   */
  protected async runAssemble(resolver?: CommonReturnResolver): Promise<any[]> {
    const output: any[] = [];
    const {
      callback,
      fallback,
    } = resolver || {};
    if (this.state === 'sync') {
      // eslint-disable-next-line no-restricted-syntax
      for (const [param, fn] of this.assembleFn) {
        this.runHook(this.hookName.beforeAssemble, [param]);
        try {
          // eslint-disable-next-line no-await-in-loop
          const result = await fn(param);
          this.runHook(this.hookName.assembled, [param, result]);

          if (typeof this.compiler.compile === 'function') {
            this.compiler.compile(param, result);
          }

          if (typeof callback === 'function') {
            callback(param, result);
          }

          output.push(result);
        } catch (err) {
          if (typeof fallback === 'function') {
            fallback(param, err);
          }

          this.runHook(this.hookName.assembleFailed, [param, err]);
        }
      }
    } else {
      // TODO 并行请求
    }
    return output;
  }

  /**
   * 更新流水线状态
   * @param state State 状态
   */
  protected updateState(state: PipeLineState): this {
    this.state = state;
    return this;
  }

  /**
   * 注入编译器
   * @param compiler Compiler 编译器
   */
  protected inject(compiler: PipeLineCompiler): this {
    this.compiler = compiler;
    return this;
  }

  /**
   * 执行流水线
   * @param resolver Object 通用返回值处理（cb、fb）
   */
  protected async run(resolver?: CommonReturnResolver): Promise<any[]> {
    const result = await this.runAssemble(resolver);
    this.updateState('compiled');
    this.runHook(this.hookName.compiled, [result]);
    this.uninstall();
    return result;
  }

  /**
   * 统一还原数据
   */
  protected uninstall(): void {
    this.assembleFn = [];
    this.compiler = {};
    this.params = {};
    Object.keys(this.hooks).forEach((key: string) => {
      this.hooks[key as HookNameType] = [];
    });
    this.updateState('uninstalled');
  }

  /**
   * 抛异常
   * @param msg 异常信息
   */
  protected throw(msg: string): void {
    throw new Error(msg);
  }
}
