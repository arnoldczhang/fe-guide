const webpack = require('webpack');
const chokidar = require('chokidar');
const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const config = require('../build/webpack.config').default;
const script = require('./watch-script');
const [compiler] = webpack([config]).compilers;

const watchOptions = {
  ignored: /node_modules/,
  stats: config.stats,
};

let startWatch = () => script.watch(resolve(__dirname, '../test/test.js'));

compiler.watch(watchOptions, (error, stats) => {
  if (!error && !stats.hasErrors()) {
    startWatch();
    startWatch = () => void 0;
    console.log('compile done');
  } else {
    console.error(stats.toString());
  }
});

const changeListener = async (path, stat) => {
  const pkgJsSrc = resolve(__dirname, '../dist/index.cjs.js');
  const content = readFileSync(pkgJsSrc, 'utf-8');
  writeFileSync(pkgJsSrc, content);
};

chokidar.watch(resolve(__dirname, '../src/pages'), { ignored: /(^|[\/\\])\../ })
  .on('change', changeListener);


