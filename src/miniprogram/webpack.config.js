const path = require('path');

module.exports = {
  mode: 'production',
  entry: {}, // TODO
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]',
    crossOriginLoading: 'anonymous',
    globalObject: 'global',
    libraryTarget: 'commonjs2',
  },
  optimization: {
    concatenateModules: false,
    runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'vendors.js',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
        },
        commons: {
          name: 'commons.js',
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.(?:jsx?|wxs)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            ['es2015', { modules: false }],
            'stage-2',
          ],
          plugins: [
            ['transform-inline-environment-variables', {
              include: [
                'NODE_ENV',
              ],
            }],
            'transform-class-properties',
            'transform-decorators-legacy',
            'transform-object-rest-spread',
            'transform-class-properties',
            'transform-object-rest-spread',
            'transform-async-functions',
            'transform-decorators',
            [
              'transform-runtime',
              {
                helpers: false,
                polyfill: false,
                regenerator: true,
              },
            ],
          ],
        },
      },
    ],
  },
};
