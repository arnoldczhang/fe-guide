const path = require('path');
const webpack = require('webpack');

// 生成index.html
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 打包前清理之前的压缩文件
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 生成配置文件，内容是资源文件和打包后文件的对应关系
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  devtool: 'inline-source-map',

  // 本地服务器
  // devServer: {
  //   contentBase: path.join(__dirname, "dist"),
  //   compress: true,
  //   hot: true,
  //   port: 8081,
  // },
  entry: {
    index: [
      "./src/webpack/src/app.js",

      // 服务端渲染，在客户端要实现hot-load，需要引入这个client
      "webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&timeout=20000",
    ],

    // 如果其他文件也要hot-load，都要引入client
    // vendor: ['jquery', 'webpack-hot-middleware/client'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '',
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

    // log中只展示打包相关的文件
    new webpack.NamedModulesPlugin(),

    // 注入hot-load
    new webpack.HotModuleReplacementPlugin(),
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