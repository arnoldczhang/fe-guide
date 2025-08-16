import { Func } from '../types';

export const hook = Object.freeze({
  __cach__: new Map(),
  /**
   * 注册hook
   * @param hookName
   * @param callback
   */
  tap(
    hookName: string,
    callback: Func,
  ) {
    const cach = this.__cach__.get(hookName) || new Set();
    cach.add(callback);
    this.__cach__.set(hookName, cach);
  },
  /**
   * 同步调用
   * @param hookName
   * @param args
   */
  callSync(
    hookName: string,
    ...args: any[]
  ) {
    const cach = this.__cach__.get(hookName);
    if (!cach) return;
    cach.forEach((callback: Func) => {
      if (typeof callback === 'function') {
        callback(...args);
      }
    });
  },
  /**
   * 同步依次返回值输入调用
   * @param hookName
   * @param args
   */
  callIterateSync(
    hookName: string,
    ...args: any[]
  ) {
    const cach = this.__cach__.get(hookName);
    if (!cach) return;
    return [...cach].reduce((res: any, callback: Func) => {
      if (typeof callback === 'function') {
        res = callback(...args, res);
      }
      return res;
    }, null);
  },
});

export const HOOK_NAME = {
  // less头部插入自定义内容
  beforeIterateInsertLess: 'insert-before-less',
  // vue-style标签头部插入自定义内容
  beforeIterateInsertVueStyle: 'insert-before-vue-style',
  //
  treeNodeFilterUpdate: 'tree-node-filter:update',
  // 允许跳过部分组件的md文件生成
  skipIterateGenMarkdown: 'skip-gen-md:update',
  // md文件生成后的回调
  afterIterateGenMarkdown: 'markdown-after-gen',
  // 配置文件生成前的回调
  beforeGenConfigFile: 'config-file-before-gen',
  // 配置文件生成后的回调
  afterGenConfigFile: 'config-file-after-gen',
};
