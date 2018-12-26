const path = require('path')
const NODE_ENV = process.env.NODE_ENV || 'production'

const config = {
  entry: {
    'test': ['./src/test.ts'],
  },
  mode: NODE_ENV,
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      enforce: 'pre',
      use: [{
        loader: 'tslint-loader',
        options: { /* Loader options go here */ }
      }],
    }, {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
      }, {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      }],
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  plugins: [
  ],
  resolve: {
    extensions: ['.*', '.js', '.jsx', '.es6', '.ts', '.tsx'],
  },
}

module.exports = config
