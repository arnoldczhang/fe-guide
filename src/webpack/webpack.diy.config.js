// 测试自己写的plugins和loader的配置
const path = require('path');
const myPlugin = require('./plugin.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: "./src/webpack/diy.js",
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'diy.bundle.js',
  },
  plugins: [
    new myPlugin({
      title: 'aaaaaaaaaaa'
    }),
    new HtmlWebpackPlugin(),
  ],
  module: {
    rules: [{
      test: /\.pojo$/,
      enforce: 'pre',
      loader: path.resolve('src/webpack/pojo-loader'),
    }],
  },
};
