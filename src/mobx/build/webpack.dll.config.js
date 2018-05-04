// webpack基础dll配置
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    common: [
      'react',
      'react-dom',
    ],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: "dll.[name].js",
    library: "[name]_[hash]",
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.join(__dirname, '[name]-manifest.json'),
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
}