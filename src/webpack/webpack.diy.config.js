const path = require('path');

module.exports = {
  entry: {
    index: "./src/webpack/diy.js",
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'diy.bundle.js',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      enforce: 'pre',
      loader: path.resolve('src/webpack/loader.js'),
    }],
  },
};
