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
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const srcPath = path.join(__dirname, '../src');

const searchFiles = (matchRe, src, result = {}, parent = '') => {
  const dirRe = /[^\.]/;
  fs.readdirSync(src).forEach((file) => {
    if (dirRe.test(file) || matchRe.test(file)) {
      const fullpath = path.join(src, file);
      if (fs.statSync(fullpath).isDirectory()) {
        searchFiles(matchRe, fullpath, result, `${parent}/${file}`);
      } else if (matchRe.test(fullpath)) {
        result[`${parent}/${file}`] = fullpath;
      }
    }
  });
  return result;
};

let count = 0;
const ensureDir = (path, callback, queue = []) => {
  console.log('path', path);
  if (count < 10) {
    count++;
  } else {
    return;
  }
  try {
    if (path) {
      const stat = fs.statSync(path);
      if (!stat.isDirectory()) {
        return;
      }
    }
    while (queue.length) {
      let dir = queue.pop();
      path = `${path}/${dir}`;
      fs.mkdirsSync(path);
    }
  } catch (err) {
    console.log('err', err, path);
    ensureDir(path.replace(/\/([^\/]+)\/?$/, (match, $1) => {
      queue.push($1);
      return '';
    }), callback, queue);
  }
  callback();
};

const copyJsonFiles = () => {
  fs.remove('destination');
  const entry = searchFiles(/\.(?:json)$/, srcPath);
  const dest = '/destination';
  Object.keys(entry).slice(0, 1).forEach((key) => {
    const filePath = entry[key];
    const file = fs.readFileSync(filePath);
    const destFile = `${dest}${key}`;
    const destPath = destFile.replace(/[^\/]+\.\w+$/, '');
    fs.copy(destFile, filePath, (err) => {
      if (err) {
        return err;
      }
      fs.writeFile(destFile, file, 'utf8');
    });
    // ensureDir(destPath, () => {
    //   fs.writeFile(destFile, file, 'utf8');
    // });
  });
};

const copyCssFiles = () => {
  const entry = searchFiles(/\.(?:wxss)$/, srcPath);
  // console.log(entry);
  const cssConfig = {
    mode: 'production',
    // entry,
    entry: {
    },
    output: {
      path: path.join(__dirname, '../destination'),
      filename: '[name]',
      crossOriginLoading: 'anonymous',
      publicPath: '',
    },
    optimization: {
      minimizer: [
        // new OptimizeCSSAssetsPlugin({
        //   cssProcessor: require('cssnano'),
        //   cssProcessorOptions: {
        //     safe: true,
        //     discardComments: {
        //       removeAll: true,
        //     }
        //   },
        // }),
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
        // {
        //   test: /\.json$/,
        //   use: [
        //     './webpack/combine-loader.js',
        //     // 'json-loader',
        //   ],
        // },
      ],
    },
  };
  // webpack(cssConfig, (err) => {
  //   if (err) {
  //     return console.log('err', err);
  //   }
  //   console.log('done');
  // });
  // console.log(entry);
  return cssConfig;
};

copyJsonFiles();
module.exports = copyCssFiles();

// (async () => {
//   await fs.removeSync('destination');
// })();


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