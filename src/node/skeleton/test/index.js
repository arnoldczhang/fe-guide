const webpack = require('webpack');
const path = require('path');
const config = require('../build/webpack.config').default;
const script = require('./watch-script');
const [compiler] = webpack([config]).compilers;

const watchOptions = {
  ignored: /node_modules/,
  stats: config.stats,
};

let startWatch = () => script.watch(path.resolve(__dirname, '../test/test.js'));

compiler.watch(watchOptions, (error, stats) => {
  if (!error && !stats.hasErrors()) {
    startWatch();
    startWatch = () => void 0;
    console.log('compile done');
  } else {
    console.error(stats.toString());
  }
});



