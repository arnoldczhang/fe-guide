// 线上配置
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');

const base = require('../../webpack/webpack.common.js');
module.exports = merge(base, {
  devtool: 'source-map',
  mode: 'production',
  entry: {
    rxjs: [
      './src/rxjs/index.js',
    ],
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './src/rxjs/index.html',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});