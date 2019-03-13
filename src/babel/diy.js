const { declare } = require('@babel/helper-plugin-utils');
const template = require('@babel/template').default;

/************plugins*************/
/**
 * self/this/xxx.createSelectorQuery -> tt.createSelectorQuery
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
const replaceCreateSelectorQuery = (path) => {
  const { node, parent } = path;
  const { name } = node;
  if (name === 'createSelectorQuery') {
    const { type } = parent.object;
    if (type === 'Identifier') {
      parent.object.name = 'tt';
    }
  }
};

/**
 * 代码中的process.env[KEY]替换成环境变量值
 * @param  {[type]} path    [description]
 * @param  {[type]} types   [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const replaceProcessEnv = (path, types, options) => {
  const { include = [] } = options;
  if (path.get('object').matchesPattern('process.env')) {
    // key => { type: 'StringLiteral', value: 'NODE_ENV' }
    const key = path.toComputedKey();
    let envKey;

    if (types.isStringLiteral(key)) {
      envKey = key.value;
    } else if (types.isBinaryExpression(key)) {
      envKey = getLeaf(types, key);
    } else {
      // console.log(key);
    }

    if (include && include.indexOf(envKey) !== -1) {
      path.replaceWith(types.valueToNode(process.env[envKey]));
    }
  }
};

/************utils*************/

const getLeaf = (types, { left, right, operator }, result = '') => {
  if (types.isStringLiteral(left)) {
    result += left.value;
  } else if (types.isBinaryExpression(left)) {
    result += getLeaf(types, left);
  }

  if (operator === '+') {
    if (types.isStringLiteral(right)) {
      result += right.value;
    } else if (types.isBinaryExpression(right)) {
      result += getLeaf(types, right);
    }
  }
  return result;
};

module.exports = declare(({ assertVersion, types }, options) => {
  assertVersion(7);
  return {
    name: "transform-diy",
    pre(file) {
    },
    visitor: {
      Program: {
        exit(path) {
          path.node.body.unshift(template(`var bb = require('./test');`)());
        }
      },
      Identifier: {
        enter(path) {
          replaceCreateSelectorQuery(path);
        },
        exit(path) {
        },
      },

      BlockStatement(path) {
      },


      BinaryExpression(path) {

      },

      MemberExpression(path) {
        replaceProcessEnv(path, types, options);
      },

      FunctionDeclaration(path) {
      },
    },
    post(file) {

    },
  };
});
