const path = require('path')

module.exports = function (content, map) {
  console.dir(this);
  this.cacheable();
  return content;
};