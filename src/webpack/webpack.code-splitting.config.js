const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const copyrightWebpackPlugin = require('./copyright-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // enforce: 'pre',
        loader: path.join(__dirname, './test-loader.js'),
        options: {},
      },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        lodash: {
          name: 'loadsh',
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          priority: 10
        },
        commons: {
          name: 'commons',
          minSize: 0, //表示在压缩前的最小模块大小,默认值是 30kb
          minChunks: 2, // 最小公用次数
          priority: 5, // 优先级
          reuseExistingChunk: true // 公共模块必开启
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: false, // 移除 HTML 中的注释
        collapseWhitespace: false, // 删除空白符与换行符
        minifyCSS: false // 压缩内联 css
      },
      filename: 'index.html', // 生成后的文件名
      template: 'index.html' // 根据此模版生成 HTML 文件
    }),
    new CleanWebpackPlugin(), // 默认情况下，此插件将删除 webpack output.path 目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
    new copyrightWebpackPlugin({
      name: 'aaaa',
    }),
    new webpack.BannerPlugin({
      banner: "hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]"
    }),
  ]
};

function run() {
  const outputOptions = {
    context: '/Users/dianping/website/webpack/test',
    colors: { level: 3, hasBasic: true, has256: true, has16m: true },
    cached: false,
    cachedAssets: false,
    exclude: [ 'node_modules', 'bower_components', 'components' ],
    infoVerbosity: 'info'
  };

  const compiler = webpack(Object.assign({}, config, {
    mode: 'development',
  }));

  compiler.run((err, stats) => {
    if (compiler.close) {
      compiler.close(err2 => {
        compilerCallback(err || err2, stats);
      });
    } else {
      compilerCallback(err, stats);
    }
  });

  function compilerCallback(err, stats) {
    if (err) {
      lastHash = null;
      console.error(err.stack || err);
      if (err.details) console.error(err.details);
      process.exit(1); // eslint-disable-line
    }
    lastHash = stats.hash;
    if (stats.compilation && stats.compilation.errors.length !== 0) {
      const errors = stats.compilation.errors;
      if (errors[0].name === "EntryModuleNotFoundError") {
        console.error("\n\u001b[1m\u001b[31mInsufficient number of arguments or no entry found.");
        console.error(
          "\u001b[1m\u001b[31mAlternatively, run 'webpack(-cli) --help' for usage info.\u001b[39m\u001b[22m\n"
        );
      }
    }
    const statsString = stats.toString(outputOptions);
    const delimiter = outputOptions.buildDelimiter ? `${outputOptions.buildDelimiter}\n` : "";
    if (statsString) console.log(`${statsString}\n${delimiter}`);
  }
};

module.exports = config;

