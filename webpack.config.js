const path = require('path');
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, '.', dir)
};

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    "./views/vue/src/app.js",
  ],
  output: {
    path: path.join(__dirname, 'lib/dist'),
    filename: '[name].123.js',
    // filename: '[name].[hash].js',
    publicPath: '/dist/',
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, './node_modules')
          ) === 0
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   sourceMap: true
    // }),
    new HTMLPlugin({
      inject: true,
      minify: {
        removeComments: false,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      template: 'views/vue/src/index.template.html',
      filename: '../../views/vue/index.html',
      // title: 'aaa',
    }),
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue: 'vue/dist/vue.js',
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('views/vue/src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        include: [resolve('views/vue/src')],
        enforce: 'pre',
        options: {
          formatter: require('eslint-friendly-formatter'),
        }
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}