const express = require('express');
const webpack = require('webpack');
const internalIP = require('internal-ip');
const webpackDevMiddleware = require('webpack-dev-middleware');
const host = internalIP.v4() || '0.0.0.0';
const port = 2222;

const app = express();
const config = require('./build/webpack.dev.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!\n`);
});