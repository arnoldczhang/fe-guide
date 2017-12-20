const path = require('path');
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, '.', dir)
};

module.exports = {
  // devtool: 'cheap-module-eval-source-map',
  entry: {
    // app: "./views/vue/src/app.js",
    flyball: './src/css_related/flyball/flyball.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].123.js',
    // filename: '[name].[hash].js',
    publicPath: '/dist/',
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module, count) {
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(
    //         path.join(__dirname, './node_modules')
    //       ) === 0
    //     )
    //   }
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor']
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   sourceMap: true
    // }),
    // new HTMLPlugin({
    //   inject: true,
    //   minify: {
    //     removeComments: false,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //   },
    //   template: 'views/vue/src/index.template.html',
    //   filename: '../../views/vue/index.html',
    //   // title: 'aaa',
    // }),
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
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [ 'es2015' ],
            },
          },
        ],
      },
      {
        test: /\.(le|c|sa)ss$/,
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
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}