// 进行项目/组件调试时，开启 development 模式
const path = require('path');
const internalIP = require('internal-ip');
const open = require('open');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const base = require('./webpack.common.js');
const host = 'localhost' || internalIP.v4() || '0.0.0.0';
const port = 2222;

const config = merge(base, {
  devtool: 'source-map',
  mode: 'development',
  entry: {
    test: 'test.js',
  },
  optimization: {
    concatenateModules: false,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new CleanWebpackPlugin(['../test/dist'], {
      root: path.join(__dirname, '..'),
    }),
    new HtmlWebpackPlugin({
      title: 'Development',
      hash: true,
      template: './src/test/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],
  devServer: {
    port,
    host,
    contentBase: './dist',
  },
});

module.exports = config;
