const path = require('path');
const Koa = require('koa');
const body = require('koa-body');
const logger = require('koa-logger');
const webpack = require('webpack');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const config = require('./webpack.config');
const compiler = webpack(config);
const app = new Koa();

app
  .use(webpackDevMiddleware(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath
  }))
  .use(webpackHotMiddleware(compiler))
  .use(body())
  .use(logger())
  ;

if (!module.parent) app.listen(3001, () => {
  console.log('koa started at 3001 port');
});