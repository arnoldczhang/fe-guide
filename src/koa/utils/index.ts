import * as Koa from 'koa';
import * as querystring from 'querystring';
import {
  Response,
  response,
} from './response';
import controller from '../controller';
import service from '../service';
import {
  CODE,
  MSG,
} from '../config/constant';

const FUNC = v => v;
const extend = (...args: Array<Object>) => Object.assign.apply(null, args);

const getQuery = (url: string = ''): Object => {
  const search: string = url.split('?')[1];
  return querystring.parse(search);
};

const abstractApi = async function(key: string, ctx: Koa.Context): void {
  const {
    body,
    url,
  } = ctx.request;
  let query: Object = getQuery(url);
  if (typeof body === 'object') {
    query = body;
  }
  const res = await controller[key](query);
  ctx.body = extend({}, response, res);
};

const abstractService = async function(key: string, data: Object): Promise {
  return new Promise((resolve, reject) => {
    service[key]({
      ...data,
    }, (resBody) => {
      resolve({
        code: CODE.SUCCESS,
        data: !Array.isArray(resBody) ? {
          ...resBody,
        } : resBody,
      });
    }, ({
      message = '',
    }) => {
      reject({
        code: CODE.FAIL,
        message: msg || MSG.ACTFAIL,
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
