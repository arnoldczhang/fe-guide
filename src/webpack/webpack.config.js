const path = require('path');
const webpack = require('webpack');

// 生成index.html
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 抽离单独文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 打包前清理之前的压缩文件
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 生成配置文件，内容是资源文件和打包后文件的对应关系
const ManifestPlugin = require('webpack-manifest-plugin');

// 1.配合import { xx, xxx }，做tree-shaking，或者命令中--optimize-minimize
// 2.配合import(....)，如下，做按需加载
// aa.onclick = () => {
//   import('./app2.js').then((res) => {
//     res.aa();
//   });
// };
// 3.配合babel-loader + require.ensure([], (require) => {...})，如下，做按需加载
// require.ensure([], (require) => {
//   const res = require('./app2.js');
//   res.aa();
// });
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// require.context去中心化
// 例：require test目录下的所有js
// ((r) => {
//   r.keys().forEach(r);
// })(require.context('../test/', true, /\.js$/));

// --env.xxx
// 获取webpack命令行的环境变量

// require.resolve获取文件绝对路径
// 例如，require.resolve('./index.ts') 
// "/Users/dianping/website/fe-guide/src/webpack/index.ts"






module.exports = {
  // devtool: 'inline-source-map',

  // 本地服务器配置，或者使用命令形式，比如webpack-dev-server --hot
  // devServer: {
  //   contentBase: path.join(__dirname, "dist"),
  //   compress: true,
  //   hot: true,
  //   port: 8081,
  // },
  entry: {
    // polyfills: './src/webpack/src/polyfills.js',
    index: [
      "./src/webpack/src/app.js",
      // 服务端渲染，在客户端要实现hot-load，需要引入这个client
      // "webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&timeout=20000",
    ],

    // 如果其他文件也要hot-load的话，都要引入client文件
    // vendor: [
    //   'underscore',
    // ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    // 普通打包的文件，命名为[name].bundle.js
    filename: '[name].[hash:5].bundle.js',
    publicPath: '',

    // 配合代码中的import(/* webpackChunkName: "xxx" */ 'xxx')，
    // 而打包的文件，命名为xxx.[chunkhash].bundle.js
    chunkFilename: '[name].[chunkhash:5].bundle.js',

    // 将打包文件命名为 `webpackNumbers`这个全局变量
    // library: 'webpackNumbers',

    // 打包文件兼容环境的方式，比如umd、window、this等
    // libraryTarget: 'umd',
  },
  // externals: {
  //   lodash: {
  //     commonjs: 'lodash',
  //     commonjs2: 'lodash',
  //     amd: 'lodash',
  //     root: '_',
  //   },
  // },
  plugins: [
    new CleanWebpackPlugin(['dist']),

    // new ManifestPlugin({
    //   fileName: '../manifest.json',
    // }),

    new HtmlWebpackPlugin({
      title: 'test',
      template: 'src/webpack/src/app.html',
      // filename: '../index.html',
    }),

    // new UglifyJSPlugin({
    //   sourceMap: true,
    // }),

    // log中只展示打包相关的文件（product）
    // new webpack.HashedModuleIdsPlugin(),

    // log中只展示打包相关的文件（development）
    // new webpack.NamedModulesPlugin(),

    // 注入hot-load
    // new webpack.HotModuleReplacementPlugin(),

    // 环境变量定义
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify('production'),
    // }),

    // 提取公共部分代码
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    // }),

    // 提取公共部分代码
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    // }),

    // 定义全局变量，对应库文件，module中可以直接使用
    // new webpack.ProvidePlugin({
    //   filter: ['underscore', 'filter'],
    // }),

    // 打包文件的顶部加些注释信息
    // new webpack.BannerPlugin({
    //   banner: 'aaaa',
    // }),

    // 注入ExtractTextPlugin
    new ExtractTextPlugin({
      filename: "[chunkhash:5].bundle.css",
      allChunks: true,
      disable: false,
    }),

  ],
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
    alias: {
      '@': path.join(__dirname, 'src'),
    },
    // extensions: ['*', 'js', 'jsx'],
  },
  module: {
    rules: [
      // https://webpack.js.org/loaders/imports-loader/
      // imports-loader：模块不用require或import某个库，在这里配置
      // {
      //   test: require.resolve('./src/number.js'),
      //   use: 'imports-loader?_=underscore',
      // },
      
      // exports-loader：模块不用定义module.exports，在这里配置exports的内容
      // {
      //   test: require.resolve('./src/test2.js'),
      //   use: 'exports-loader?abs=nn.abs',
      // },
      {
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
                plugins: (loader) => [
                  require('autoprefixer')({
                    browsers: [
                      'Android >= 4.0',
                      'last 3 versions',
                      'iOS > 6'
                    ],
                  }),
                ],
              },
            },
          ],
          fallback: 'style-loader',
          publicPath: '/dist',
        })
      },
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        options: {
          failOnError: true,
        },
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [ 'es2015' ],
              plugins: ['transform-runtime'],
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          'ts-loader',
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  }
}