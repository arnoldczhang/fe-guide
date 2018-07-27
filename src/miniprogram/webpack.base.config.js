/* eslint-disable */
// webpack基础配置
const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const color = require('chalk');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const srcPath = path.join(__dirname, '../src');
const {
  searchFiles,
  compressFile,
  checkFuncAndRun,
} = require('./utils');

const copyCompressFile = (
  filePath,
  destPath,
  options = {},
) => {
  const {
    compress = true,
    dest = '/destination',
    encode = 'utf8',
  } = options;
  const destFile = path.join(__dirname, `../${dest}${destPath}`);
  try {
    const file = compressFile(fs.readFileSync(filePath), compress);
    fs.copy(filePath, destFile, (err) => {
      if (err) {
        return err;
      }
      fs.writeFile(destFile, file, encode);
    });
  } catch (err) {
    console.log(color.red(err));
  }
};

const copyCompressFiles = (re, hooks = {}) => (compress = true) => {
  const entry = searchFiles(re, srcPath);
  checkFuncAndRun(hooks.start, srcPath);
  Object.keys(entry).forEach(key => (
    copyCompressFile(entry[key], key, { compress })
  ));
  checkFuncAndRun(hooks.end, srcPath);
};

const copyJsonFiles = copyCompressFiles(/\.(?:json)$/, {
  start(src) {
    console.log(color.green(`start copy json files from Src: ${src} START...`));
  },
  end(src) {
    console.log(color.green(`start copy json files from Src: ${src} END...`));
  },
  // willCompress: ,
  // didCompress: ,
  // willCopy: ,
  // didCopy: ,
  // end: ,
});
const copyWxmlFiles = copyCompressFiles(/\.(?:wxml)$/);

const copyCssFiles = (webpackFlag, cb) => {
  const entry = searchFiles(/\.(?:wxss)$/, srcPath);
  // console.log(entry);
  const cssConfig = {
    mode: 'production',
    entry,
    // output: {
    //   path: path.join(__dirname, '../destination'),
    //   filename: '[name]',
    //   crossOriginLoading: 'anonymous',
    //   publicPath: '',
    // },
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessor: require('cssnano'),
          cssProcessorOptions: {
            safe: true,
            discardComments: {
              removeAll: true,
            }
          },
        }),
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '../destination[name]',
      }),
      new CleanWebpackPlugin(['./destination'], {
        root: path.join(__dirname, '..'),
      }),
    ],
    module: {
      rules: [
        // {
        //   test: /\.js$/,
        //   enforce: 'pre',
        //   loader: 'eslint-loader',
        //   include: path.resolve(__dirname, './src'),
        //   exclude: /node_modules/,
        //   options: {
        //     failOnError: false,
        //   },
        // },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              'es2015',
              'stage-2',
            ],
            plugins: [
              'transform-runtime',
              'transform-decorators-legacy',
              'transform-class-properties',
              'syntax-async-generators',
            ],
          },
        },
        {
          test: /\.wxss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                import: false,
              },
            },
            // {
            //   loader: 'less-loader',
            //   options: {
            //   },
            // },
            // {
            //   loader: 'postcss-loader',
            //   options: {
            //     plugins: () => [
            //       autoprefixer({
            //         browsers: [
            //           'Android >= 4.0',
            //           'last 3 versions',
            //           'iOS > 6',
            //         ],
            //       }),
            //     ],
            //   },
            // },
            './webpack/combine-loader.js',
          ],
        },
      ],
    },
  };

  if (webpackFlag) {
    webpack(cssConfig, (err) => {
      if (err) {
        return console.log('err', err);
      }
      console.log('done');
      cb && cb();
    });
  }
  return cssConfig;
};

const copyJsFiles = () => {

};

module.exports = copyCssFiles();

 

(async () => {
  copyJsFiles(true);
  copyCssFiles(true);
  copyJsonFiles();
  copyWxmlFiles();
})();










  



// const srcPath = path.join(__dirname, '../src');
// const entry = listFiles(srcPath);
// const extractCSS = new ExtractTextPlugin('[name].css');
// console.log(entry);

// const config = {
//   mode: 'development',
//   entry,
//   output: {
//     path: path.join(__dirname, '../destination'),
//     filename: '[name]',
//     // chunkFilename: '[name]',
//     // sourceMapFilename: '[file].map',
//     crossOriginLoading: 'anonymous',
//     publicPath: '',
//   },
//   plugins: [
//     new MiniCssExtractPlugin({
//       // Options similar to the same options in webpackOptions.output
//       // both options are optional
//       filename: '[name].wxss',
//       // chunkFilename: "[id]",
//     }),
//     // extractCSS,
//     // new ExtractTextPlugin('style.css'),
//     // new UglifyJSPlugin({
//     //   sourceMap: true,
//     // }),
//     new webpack.DefinePlugin({
//       'process.env.NODE_ENV': JSON.stringify('production'),
//     }),
//     new CleanWebpackPlugin(['./destination'], {
//       root: path.join(__dirname, '..'),
//     }),
//     // new ConsoleLogOnBuildWebpackPlugin({
//     //   path: path.join(__dirname, './src'),
//     // }),
//     // new CopyWebpackPlugin([{
//     //   from: path.join(__dirname, '../src/**/*.wxss'),
//     //   to: '../destination/[path]/[name].[ext]',
//     // }]),
//   ],
//   // optimization: {
//   //   splitChunks: {
//   //     chunks: 'all',
//   //   },
//   // },
//   resolve: {
//     extensions: ['.*', '.js', '.jsx', '.es6'],
//   },
//   module: {
//     rules: [
//       // {
//       //   test: /\.js$/,
//       //   enforce: 'pre',
//       //   loader: 'eslint-loader',
//       //   include: path.resolve(__dirname, './src'),
//       //   exclude: /node_modules/,
//       //   options: {
//       //     failOnError: false,
//       //   },
//       // },
//       {
//         test: /\.jsx?$/,
//         exclude: /node_modules/,
//         loader: 'babel-loader',
//         options: {
//           babelrc: false,
//           presets: [
//             'es2015',
//             'stage-2',
//           ],
//           plugins: [
//             'transform-runtime',
//             'transform-decorators-legacy',
//             'transform-class-properties',
//             'syntax-async-generators',
//           ],
//         },
//       },
//       {
//         test: /\.(wx|ht)ml?$/,
//         include: path.resolve(__dirname, './src'),
//         exclude: /node_modules/,
//         use: ExtractTextPlugin.extract(['html-loader', path.join(__dirname, 'combine-loader')]),
//       },
//       {
//         test: /\.(le|c|sa|wx)ss$/,
//         use: [
//           MiniCssExtractPlugin.loader,
//           'css-loader',
//           // {
//           //   loader: 'postcss-loader',
//           //   options: {
//           //     plugins: () => [
//           //       autoprefixer({
//           //         browsers: [
//           //           'Android >= 4.0',
//           //           'last 3 versions',
//           //           'iOS > 6',
//           //         ],
//           //       }),
//           //     ],
//           //   },
//           // },
//           // 'less-loader',
//           // {
//           //   loader: 'less-loader',
//           //   options: {
//           //     minimize: true,
//           //   },
//           // },
//           './webpack/combine-loader.js',
//         ],
//       },
//       {
//         test: /\.(gif|png|jpe?g|svg)$/i,
//         exclude: /(node_modules|bower_components)/,
//         use: [
//           {
//             loader: 'url-loader',
//             options: {
//               limit: 10000,
//               name: '[name]',
//             },
//           },
//           {
//             loader: 'file-loader',
//             // loader: 'image-webpack-loader',
//             options: {
//               name: 'utils/images/[name].[ext]',
//               // mozjpeg: {
//               //   progressive: true,
//               //   quality: 65,
//               // },
//               // optipng: {
//               //   progressive: true,
//               //   quality: 65,
//               // },
//             },
//           },
//         ],
//       },
//       {
//         test: /\.(woff|woff2|eot|ttf|otf)$/,
//         use: [
//           'file-loader',
//         ],
//       },
//     ],
//   },
// };

// module.exports = config;