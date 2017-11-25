const path = require('path');
module.exports = env => {
  console.log('==============NODE_ENV: ', env.NODE_ENV) // 'local'
  console.log('==============Production: ', env.production) // true
  return {
    entry: './src/webpack/src/test2.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
};