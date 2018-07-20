const internalIP = require('internal-ip');
const DEV_DIST_DIR = '/build/';
const host = internalIP.v4.sync() || '0.0.0.0';
const port = 2222;

module.exports = (paths, options = {}) => {
  return {
    host,
    port,
    hot: true,
    compress: true,
    progress: true,
    open: true,
    contentBase: paths.path,
  };
};
