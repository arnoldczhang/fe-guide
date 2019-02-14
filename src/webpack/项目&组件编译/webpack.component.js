// 进行组件编译时，开启 production 模式
// 利用 webpack-node-externals 插件忽略 node_modules
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const base = require('../../webpack/webpack.common.js');

module.exports = merge(base, {
  mode: "production",
  externals: [nodeExternals()],
});