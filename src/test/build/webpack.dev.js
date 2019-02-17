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
  // devtool: 'source-map',
  mode: 'development',
  entry: {
    // webdriver: './src/test/src/webdriver.js',
    // wired: './src/test/src/wired-elements.js',
    // filepond: './src/test/src/filepond.js',
    // chance: './src/test/src/chance.js',
    // lumin: './src/test/src/lumin.js',
    // can: './src/test/src/can.js',
    // tui: './src/test/src/tui.js',
    // asciichart: './src/test/src/asciichart.js',
    test: './src/test/src/test.js',
    // jsx: './src/test/src/jsx.jsx',
  },
  optimization: {
    concatenateModules: false,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',// 默认 async 可选值 all 和 initial
      maxInitialRequests: Infinity,// 一个入口最大的并行请求数
      minSize: 0,// 避免模块体积过小而被忽略
      minChunks: 1, // 默认也是一表示最小引用次数
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,// 如果需要的依赖特别小，可以直接设置成需要打包的依赖名称
          name(module, chunks, chcheGroupKey) {// 可提供布尔值、字符串和函数，如果是函数，可编写自定义返回值
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];// 获取模块名称
            return `npm.${packageName.replace('@', '')}`;// 可选，一般情况下不需要将模块名称 @ 符号去除
          },
        },
      },
    },
  },
  plugins: [
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
