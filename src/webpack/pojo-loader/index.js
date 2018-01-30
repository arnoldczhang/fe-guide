const path = require('path');
const _ = require('./lib');

module.exports = function (content, sourcemap) {
  // TODO for debug
  const callback = this.async();
  if (this.cacheable) this.cacheable();
  content = typeof content === 'string' ? content : String(content);
  const nameResult = _.nameRE.exec(this.resource);
  const className = _.capital(nameResult ? nameResult[1] : `class${_.genRandom()}`);
  const expressions = content.split(_.splitRE).filter(_.identity).map(_.toSpace).filter(_.identity);
  const codeArr = [
    `
      /**
       * ${className}
       * @description the prototype of ${className} class
       * @type {Object} options
       */
      function ${className} (options = {}) {
        if (!(this instanceof ${className})) {
          return new ${className}(options);
        }
        this.options = options;
      };
    `
  ];
  Array.prototype.push.apply(codeArr, _.format(expressions, className));
  codeArr.push(`exports = module.exports = ${className};`);
  return codeArr.join(``);
};