const {
  join,
  resolve,
} = require("path");
const {
  BundleAnalyzerPlugin,
} = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const WriteFileWebpackPlugin = require("write-file-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require("webpack");

const dev = process.env.NODE_ENV !== "production";
const plugins = [
  new FriendlyErrorsWebpackPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  })
];

const filepath = "./client.tsx";

if (!dev) {
  plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: "static",
    reportFilename: "webpack-report.html",
    openAnalyzer: false,
  }));
} else {
  plugins.push(
    new CleanWebpackPlugin(),
    new WriteFileWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  );
}

module.exports = {
  mode: dev ? "development" : "production",
  context: join(__dirname, "src"),
  devtool: dev ? "none" : "source-map",
  entry: {
    app: filepath,
  },
  node: {
    net: 'empty',
    fs: 'empty',
  },
  resolve: {
    modules: [
      resolve("./src"),
      "node_modules"
    ],
    alias: {
      // 'react-dom': '@hot-loader/react-dom',
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  module: {
    rules: [{
      test: /\.(tsx|ts)?$/,
      include: resolve(__dirname, "./src"),
      exclude: /node_modules/,
      use: ["ts-loader"],
    }, {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: "babel-loader",
      options: {
        cacheDirectory: true,
      },
    }, {
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
              plugins: () => [
                require('autoprefixer')({
                  browsers: [
                    'Android >= 4.0',
                    'last 3 versions',
                    'iOS > 6'
                  ],
                })
              ],
            },
          }
        ],
        fallback: 'style-loader',
        publicPath: '/dist',
      })
    }],
  },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[name].[chunkhash].js",
    publicPath: '/dist/',
  },
  plugins,
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