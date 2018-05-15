const path = require('path');
const internalIP = require('internal-ip');
const open = require('open');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const base = require('../../webpack/webpack.common.js');
const host = internalIP.v4() || '0.0.0.0';
const port = 2222;

const config = merge(base, {
  devtool: 'source-map',
  mode: 'development',
  entry: {
    rxjs: [
      './src/rxjs/test.js',
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './src/rxjs/index.html',
    }),
  ],
  devServer: {
    port: 2222,
    contentBase: './dist',
   },
});

module.exports = config;
