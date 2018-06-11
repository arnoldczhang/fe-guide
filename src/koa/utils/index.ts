import * as Koa from 'koa';
import * as querystring from 'querystring';
import {
  response,
} from './response';
import controller from '../controller';
import service from '../service';
import {
  CODE,
  MSG,
  FUNC,
} from '../config/constant';

const extend = (...args: Array<Object>) => Object.assign.apply(null, args);
const invariant = (expr: boolean, errorMessage?: string): boolean | void => {
  if (!expr) {
    throw new Error(errorMessage || 'error');
  }
  return true;
};

const getQuery = (url: string = ''): Object => {
  const search: string = url.split('?')[1];
  return querystring.parse(search);
};

async function abstractApi(key: string, ctx: Koa.Context) {
  const {
    request: {
      body,
      url,
    },
  } = ctx;
  let query: Object = getQuery(url);
  invariant(!!controller[key], 'controller not found');
  if (typeof body === 'object' && Object.keys(body).length) {
    query = body;
  }
  const res = await controller[key](query);
  ctx.body = extend({}, response, res);
};

async function abstractService(key: string, data?: Object): Promise<Object> {
  return new Promise((resolve, reject) => {
    invariant(!!service[key], 'service not found');
    service[key]({
      ...data,
    }, (resBody: Object): void => {
      resolve({
        code: CODE.SUCCESS,
        data: !Array.isArray(resBody) ? {
          ...resBody,
        } : resBody,
      });
    }, ({
      message = MSG.ACTFAIL,
    }): void => {
      reject({
        code: CODE.FAIL,
        message,
      });
    });
  });
};

export {
  FUNC,
  getQuery,
  abstractApi,
  abstractService,
  extend,
}
