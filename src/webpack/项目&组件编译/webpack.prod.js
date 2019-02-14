// 线上配置
// 进行项目编译时，开启 production 模式
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const base = require('../../webpack/webpack.common.js');

module.exports = merge(base, {
  devtool: 'source-map',
  mode: 'production',
  entry: {
    test: [
      './src/test/index.js',
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
      template: './src/test/index.html',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});