const webpack = require('./webpack.build-online');

module.exports = ((conf = {}, cb) => {
  return new Promise((resolve, reject) => {
    conf = Object.assign({}, {
      env: 'prod',
      entryKey: 'test',
      entryUrl: './src/test.js',
    }, conf);
    webpack(conf, (...args) => {
      cb.apply(null, args);
      resolve();
    });
  });
});