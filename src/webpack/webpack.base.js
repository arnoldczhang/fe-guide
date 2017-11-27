const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    index: "./src/webpack/src/app.js",
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '',
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "[chunkhash:5].bundle.css",
      allChunks: true,
      disable: false,
    }),
    new CleanWebpackPlugin(['dist']),
    new ManifestPlugin({
      fileName: '../manifest.json',
    }),
    new HtmlWebpackPlugin({
      title: 'test',
      template: 'src/webpack/src/app.html',
    }),
  ],
  resolve: {
  },
  module: {
    rules: [
      {
        test: /\.(le|c|sa)ss$/,
        use: ExtractTextPlugin.extract({
          use:[
            {
              loader: 'css-loader',
              options:{
                modules:true,
                importLoaders:1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            'less-loader',

            // css module + autoprefixer
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('autoprefixer')({
                    browsers: [
                      'Android >= 4.0',
                      'last 3 versions',
                      'iOS > 6'
                    ],
                  }),
                ],
              },
            },
          ],
          fallback: 'style-loader',
          publicPath: '/dist',
        })
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