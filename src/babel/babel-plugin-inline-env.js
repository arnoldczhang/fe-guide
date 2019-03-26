const { declare } = require('@babel/helper-plugin-utils');

/**
 * 代码中的process.env[KEY]替换成环境变量值
 * @param  {[type]} path    [description]
 * @param  {[type]} types   [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function replaceProcessEnv(path, types, options) {
  const { include = [] } = options;
  if (path.get('object').matchesPattern('process.env')) {
    // key => { type: 'StringLiteral', value: 'NODE_ENV' }
    const key = path.toComputedKey();
    const envKey = connectStr.call(this, types, key);
    if (include && include.indexOf(envKey) !== -1) {
      path.replaceWith(types.valueToNode(process.env[envKey]));
    }
  }
};

/************utils*************/

function getLeaf(types, { left, right, operator }, result = '') {
  result = connectStr.call(this, types, left, result);
  if (operator === '+') {
    result = connectStr.call(this, types, right, result);
  }
  return result;
};

function connectStr(types, node, result = '') {
  if (types.isStringLiteral(node)) {
    result += node.value;
  } else if (types.isBinaryExpression(node)) {
    result += getLeaf.call(this, types, node);
  } else if (types.isIdentifier(node)) {
    result += this.__valueMap[node.name] || '';
  }
  return result;
};

module.exports = declare(({ assertVersion, types }, options) => {
  assertVersion(7);
  return {
    name: "inline-env",
    visitor: {
      MemberExpression(path) {
        replaceProcessEnv.call(this, path, types, options);
      },

      VariableDeclarator(path) {
        const { node } = path;
        const { id: { name }, init } = node;
        this.__valueMap = this.__valueMap || {};
        this.__valueMap[name] = init === null ? init : init.value;
      },

    },
  };
});
