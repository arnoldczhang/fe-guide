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
  STYLE_UPDATE: 'style:update',
  VUE_STYLE_UPDATE: 'vue-style:update',
  FILTER_TREE_UPDATE: 'tree-filter:update',
};
