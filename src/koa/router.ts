import * as fs from 'fs';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import {
  abstractApi,
} from './utils';

const router: Router = new Router();

async function index(ctx: Koa.Context) {
  ctx.body = 'hello world';
};

async function test (ctx: Koa.Context) {
  await abstractApi('getInfo', ctx);
};


/*
  Router
 */
router
  .get('/', index)
  .get('/test', test)
  ;

module.exports = router;