const path = require('path');
const Koa = require('koa');
const body = require('koa-body');
const logger = require('koa-logger');
const views = require('koa-views');
const compress = require('koa-compress');
const staticServer = require("koa-static");
const fs = require('fs');
const internalIP = require('internal-ip');
const host = internalIP.v4();

const getViewPath = (fileName = '') => path.join(__dirname, `./views/${fileName ? fileName + '.ejs' : ''}`);
const router = require('./config/router')(getViewPath);
const app = new Koa();

app
  .use(views(getViewPath(), { extension: 'ejs' }))
  .use(staticServer(path.join(__dirname, './lib')))
  .use(body())
  .use(logger())
  .use(compress())
  .use(router.routes())
  .use(router.allowedMethods())
  ;

app.listen(3003, () => {
  console.log('start at 3003');
});
