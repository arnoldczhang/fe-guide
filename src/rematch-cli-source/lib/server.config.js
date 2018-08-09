module.exports = (config) => {
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  config.resolve.alias['webpack-hot-client/client'] = require.resolve('webpack-hot-client/client');
  return config;
};
