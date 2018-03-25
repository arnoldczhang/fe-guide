const path = require('path');
const internalIP = require('internal-ip');
const open = require('open');
const webpack = require('webpack');
const merge = require('webpack-merge');

const base = require('./webpack.base.js');
const host = internalIP.v4() || '0.0.0.0';
const port = 2222;

const config = merge(base, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    port: 2222,
    contentBase: './dist',
   },
});

module.exports = config;
