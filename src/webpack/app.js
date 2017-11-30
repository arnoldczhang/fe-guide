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
const open = require('open');
const internalIP = require('internal-ip');
const host = internalIP.v4() || '0.0.0.0';
const port = 3001;

app
  .use(webpackDevMiddleware(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath
  }))
  .use(webpackHotMiddleware(compiler))
  .use(body())
  .use(logger())
  ;

if (!module.parent) app.listen(port, () => {
  console.log(`koa started at ${port} port`);
  open(`http://${host}:${port}`);
});