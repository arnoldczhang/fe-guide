const path = require('path');
const internalIP = require('internal-ip');
const open = require('open');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const base = require('../../webpack/webpack.common.js');
const host = 'localhost' || internalIP.v4() || '0.0.0.0';
const port = 2222;

const config = merge(base, {
  devtool: 'source-map',
  mode: 'development',
  entry: {
    webdriver: './src/test/src/webdriver.js',
    wired: './src/test/src/wired-elements.js',
    filepond: './src/test/src/filepond.js',
    chance: './src/test/src/chance.js',
    lumin: './src/test/src/lumin.js',
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          name: 'vendor',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          enforce: true,
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
      // filename: '../test/dist/index.min.html',
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
