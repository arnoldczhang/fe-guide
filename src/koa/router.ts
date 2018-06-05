import * as fs from 'fs';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import {
  abstractApi,
} from './utils';

const router: Router = new Router();

async function index(ctx: Koa.Context): Promise<Object | string | void> {
  return new Promise((resolve) => {
    ctx.body = 'hello world';
    resolve();
  });
};

async function user (ctx: Koa.Context): Promise<Object | string | void> {
  return await abstractApi('getInfo', ctx);
};


/*
  Router
 */
router
  .get('/', index)
  .get('/user', user)
  ;

module.exports = router;