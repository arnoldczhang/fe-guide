import { Context } from 'koa';
import 'reflect-metadata';

import dayjs = require('dayjs');

const actionsDefinitions: Array<
  Readonly<{
    method: 'get' | 'post';
    path: string;
    action: (ctx: Context) => any;
  }>
> = [];
type ParamType = 'date' | true | 'date?' | '?';

function parseParam(value: any, type: ParamType): any {
  if (type === 'date' && value) {
    return dayjs(value).toDate();
  } if (type === 'date?' && value) {
    return dayjs(value).toDate();
  }
  return value;
}

export function action(
  method: 'get' | 'post',
  path: string,
  paramsType?: { [paramName: string]: ParamType },
) {
  console.log(method, path);
  return function (
    target: any,
    propertyKey: string,
  ) {
    const Controller = target.constructor;
    const action = propertyKey;

    actionsDefinitions.push({
      method,
      path,
      action: (ctx: Context) => {
        const params = {};
        if (paramsType) {
          Object.keys(paramsType).reduce<{ [key: string]: any }>((result, name) => {
            if (ctx.request.body) {
              result[name] = parseParam(
                ctx.request.body && ctx.request.body[name],
                paramsType[name],
              );
            }
            if (typeof result[name] === 'undefined') {
              result[name] = parseParam(
                ctx.request.query && ctx.request.query[name],
                paramsType[name],
              );
            }
            console.log(name, result[name]);
            if (paramsType[name].toString().indexOf('?') !== -1 && typeof result[name] === undefined) {
              throw new Error(`错误的参数值。${name}，期望类型:${paramsType[name]}。`);
            }
            return result;
          }, params);
        }
        return new Controller(ctx)[action](params);
      },
    });
  };
}

export function getActions() {
  return [...actionsDefinitions];
}

type NotPromise<T> = T extends Promise<any> ? never : T;

export abstract class AbstractController {
  constructor(protected ctx: Context) {}

  protected createSuccessResponse<T>(data: NotPromise<T>) {
    this.ctx.body = {
      code: 0,
      data,
    };
    this.ctx.status = 200;
  }

  protected createFailResponse(msg: string) {
    this.ctx.body = {
      code: 1,
      msg,
    };
    this.ctx.status = 200;
  }

  createErrorResponse(msg: string) {
    this.ctx.body = {
      code: 1,
      msg,
    };
    this.ctx.status = 400;
  }
}
