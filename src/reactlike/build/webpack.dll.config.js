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
    path: path.join(__dirname),
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
    extensions: ['.*', '.js', '.jsx', '.es6'],
    alias: {
      'react': 'anujs',
      'react-dom': 'anujs',
      'prop-types': 'anujs/lib/ReactPropTypes',
      'create-react-class': 'anujs/lib/createClass',
      'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin'
    },
  },
}