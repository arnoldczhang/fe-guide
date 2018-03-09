const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    foo: "./src/mobx/src/foo.js",
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(['../dist']),
    new HtmlWebpackPlugin({
      title: 'Development'
    }),
  ],
  module: {
      rules: [{
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "../src"),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['syntax-async-generators'],
            },
          },
        ],
      }],
  },
};