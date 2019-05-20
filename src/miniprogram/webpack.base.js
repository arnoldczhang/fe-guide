// webpack基础配置
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const listFiles = (srcpath, result = {}, parentpath = '') => {
  fs.readdirSync(srcpath).forEach((file) => {
    if (/(DS_Store|\.json)/.test(file)) {
      return;
    }
    const fullpath = path.join(srcpath, file);
    if (fs.statSync(fullpath).isDirectory()) {
      return listFiles(fullpath, result, `${parentpath}/${file}`);
    }
    result[`${parentpath}/${file}`] = fullpath;
  });
  return result;
};

const entry = listFiles(path.join(__dirname, 'src'));
// console.log(entry);

const config = {
  mode: 'production',
  entry,
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name]',
    chunkFilename: '[name]',
    sourceMapFilename: '[file].map',
    crossOriginLoading: 'anonymous',
    libraryTarget: 'commonjs2',
    publicPath: '',
  },
  plugins: [
    new ExtractTextPlugin('[name]'),
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new CleanWebpackPlugin(['./dist'], {
      root: path.join(__dirname, '.'),
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'src/*.json'),
      to: '[name].[ext]',
    }, {
      from: path.join(__dirname, 'src/pages/**/*.json'),
      to: 'pages/[folder]/[name].[ext]',
    }]),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['.*', '.js', '.jsx', '.es6'],
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   enforce: 'pre',
      //   loader: 'eslint-loader',
      //   include: path.resolve(__dirname, './src'),
      //   exclude: /node_modules/,
      //   options: {
      //     failOnError: false,
      //   },
      // },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            'es2015',
            'stage-2',
          ],
          plugins: [
            'transform-runtime',
            'transform-decorators-legacy',
            'transform-class-properties',
            'syntax-async-generators',
          ],
        },
      },
      {
        test: /\.(tsx|ts)?$/,
        include: path.resolve(__dirname, './src'),
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.(wx|ht)ml?$/,
        include: path.resolve(__dirname, './src'),
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract(['html-loader', path.join(__dirname, 'combine-loader')]),
      },
      {
        test: /\.(le|c|sa|wx)ss$/,
        use: ExtractTextPlugin.extract(['css-loader', path.join(__dirname, 'combine-loader')]),
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name]',
            },
          },
          {
            loader: 'file-loader',
            // loader: 'image-webpack-loader',
            options: {
              name: 'utils/images/[name].[ext]',
              // mozjpeg: {
              //   progressive: true,
              //   quality: 65,
              // },
              // optipng: {
              //   progressive: true,
              //   quality: 65,
              // },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
};

module.exports = config;