const path = require('path');
const internalIP = require('internal-ip');
const open = require('open');
const webpack = require('webpack');
const merge = require('webpack-merge');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const base = require('./webpack.base.js');

const host = internalIP.v4() || '0.0.0.0';
const port = 2222;

const config = merge(base, {
  devtool: 'source-map',
  mode: 'development',
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require("../build/common-manifest.json"),
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    // new BundleAnalyzerPlugin(),
  ],
  devServer: {
    port,
    compress: true,
    contentBase: './dist',
    allowedHosts: [],
  },
});

module.exports = config;
