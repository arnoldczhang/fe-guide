const path = require('path')

module.exports = function (content, sourcemap) {
  this.cacheable();
  console.log(content);
  return content;
};