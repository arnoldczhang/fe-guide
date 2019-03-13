const path = require('path');

module.exports = {
  entry: {
    'portm-wxapp': ['./test/test1.js'],
  },
  output: {
    path: path.join(__dirname, './src/webpack/dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: 'global',
    publicPath: '',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  plugins: [],
  resolve: {
    extensions: ['.*', '.js', '.jsx', '.es6', '.ts', '.tsx'],
  },
};
