import * as path from 'path';
import Koa from 'koa';
import * as body from 'koa-body';
import logger from 'koa-logger';
import webpack from 'webpack';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import * as config from './webpack.ts.config';
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

app.listen(3001, () => {
  console.log('koa started at 3001 port');
});