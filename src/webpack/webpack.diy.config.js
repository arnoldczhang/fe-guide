const path = require('path');
const myPlugin = require('./plugin.js');

module.exports = {
  entry: {
    index: "./src/webpack/diy.js",
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'diy.bundle.js',
  },
  plugins: [
    new myPlugin({
      title: 'aaaaaaaaaaa'
    }),
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      enforce: 'pre',
      loader: path.resolve('src/webpack/loader.js'),
    }],
  },
};
