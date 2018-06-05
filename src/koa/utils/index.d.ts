import * as Koa from 'koa';
import { FUNC } from '../config/constant';
declare const extend: (...args: Object[]) => any;
declare const getQuery: (url?: string) => Object;
declare function abstractApi(key: string, ctx: Koa.Context): Promise<void>;
declare function abstractService(key: string, data?: Object): Promise<Object>;
export { FUNC, getQuery, abstractApi, abstractService, extend };
