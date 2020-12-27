import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
// import * as soa from '@hb/node-soa';
import * as cors from 'koa-cors';
import glob = require('glob');
import AppRoutes from './router';
import config from './config';
import { Context } from 'koa';
import job from './job';

const pkg = require('../package.json');

// 展示bull-board的ui
const { UI } = require('bull-board');
const expressApp = require('express')();
expressApp.use('/monitor', UI);

const app = new Koa();
const router = new Router();
AppRoutes.forEach(route => router[route.method](route.path, route.action));
router.all('/monitor*', (ctx) => {
  if (ctx.status === 404) {
    delete ctx.res.statusCode;
  }
  ctx.respond = false;
  expressApp(ctx.req, ctx.res);
});
app
  .use(
    cors({
      credentials: true,
    }),
  )
  .use(bodyParser())
  .use(router.allowedMethods())
  .use(async (ctx: Context, next) => {
    try {
      await next();
    } catch (e) {
      if (e.code) {
        ctx.status = 200;
        ctx.body = { code: e.code, msg: e.message };
      } else {
        ctx.status = 500;
        ctx.body = e.message + '\n' + e.stack;
      }
    }
  })
  .use(router.routes())

app.on('error', (err: Error) => {
  // eslint-disable-next-line no-console
  console.log('onerror', err);
});

app.listen(config.port, '0.0.0.0');

const main = async () => {
  // await soa.init({
  //   env: config.ENV,
  //   appid: pkg.name,
  //   dep: [
  //     'AppSoaDemoServerService',
  //     'AppHelloBikeAuthService'
  //   ],
  // });
  await job();
};

main();
