const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

function resolve (dir) {
  return path.join(__dirname, '.', dir)
};

module.exports = {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8081,
  },
  entry: {
    app: "./src/webpack/src/app.js",
    app2: "./src/webpack/src/app2.js",
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ManifestPlugin({
      fileName: '../manifest.json',
    }),
    new HtmlWebpackPlugin({
      title: 'test',
      template: 'src/webpack/src/app.html',
      // filename: '../index.html',
    }),
  ],
  resolve: {
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  }
}