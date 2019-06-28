import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import * as nodeExternals from 'webpack-node-externals';

const dev = process.env.NODE_ENV === 'development';

const config: webpack.Configuration = {
  mode: dev ? 'development' : 'production',
  name: 'server',
  target: 'node',
  performance: {
    hints: false,
  },
  entry: {
    ['index.cjs']: './src/index.ts',
  },
  externals: [
    nodeExternals({
      whitelist: /\.wxss$/,
    }),
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    // libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js', '.mjs', '.json', '.jsx', '.ts', '.tsx', '.css'],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src/'),
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
    ],
  },
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: false,
    timings: true,
    version: false,
  },
};

export default config;
