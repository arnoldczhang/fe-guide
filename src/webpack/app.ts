import path from 'path';
import Koa from 'koa';
import body from 'koa-body';
import logger from 'koa-logger';
import webpack from 'webpack';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import config from './webpack.ts.config';
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