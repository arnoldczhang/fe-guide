// webpack基础配置
// const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { join, resolve } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].chunk.[chunkhash].js',
    // sourceMapFilename: '[file].[chunkhash].map',
    crossOriginLoading: 'anonymous',
    publicPath: '/',
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "[chunkhash:5].bundle.css",
      allChunks: true,
      disable: false,
    }),
    new webpack.HashedModuleIdsPlugin(), // 根据模块的相对路径生成 HASH 作为模块 ID
  ],
  node: {
    fs: 'empty',
  },
  resolve: {
    extensions: ['.*', '.js', '.jsx', '.es6'],
    alias: {
      'react': 'anujs',
      'react-dom': 'anujs',
      'prop-types': 'anujs/lib/ReactPropTypes',
      'create-react-class': 'anujs/lib/createClass',
      'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin'
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: resolve(__dirname, "../src"),
        exclude: /node_modules/,
        options: {
          failOnError: false,
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            'react',
            ['es2015', { modules: false }],
            'stage-2',
          ],
          plugins: [
            'transform-runtime',
            'transform-decorators-legacy',
            'transform-class-properties',
            'syntax-async-generators',
            ['transform-react-jsx', {
              pragma: 'React.createElement',
            }],
          ],
        },
      },
      // ts-node
      // https://webpack.js.org/configuration/configuration-languages/
      {
        test: /\.(tsx|ts)?$/,
        // include: path.resolve(__dirname, "../src"),
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: resolve(__dirname, '../tsconfig.json'),
            },
          },
        ],
      },
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