// https://webpack.js.org/configuration/dev-server
// 内置了webpack server，node命令启动
// node ./src/webpack/webpack.server.js
const path = require('path');
const internalIP = require('internal-ip');
const open = require('open');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const merge = require('webpack-merge');

const base = require('./webpack.base.js');
const host = internalIP.v4() || '0.0.0.0';
const port = 2222;

const config = merge(base, {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    noInfo: false,
    useLocalIp: true,
    hot: true,
    open: true,
    host,
    port,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    },
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
    },
  },
});

webpackDevServer.addDevServerEntrypoints(config, config.devServer);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, config.devServer);

server.listen(port, host, () => {
  console.log(`dev server listening on port ${port}`);
  open(`http://${host}:${port}`);
});
