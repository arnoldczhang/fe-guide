const { declare } = require('@babel/helper-plugin-utils');
const template = require('@babel/template').default;

// self/this/xxx.createSelectorQuery -> tt.createSelectorQuery
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

// 代码中的process.env[KEY]替换成环境变量值
const replaceProcessEnv = (path, types, options) => {
  const { include = [] } = options;
  if (path.get('object').matchesPattern('process.env')) {
    // key => { type: 'StringLiteral', value: 'NODE_ENV' }
    const key = path.toComputedKey();
    let envKey;

    // console.log(key);

    if (types.isStringLiteral(key)) {
      envKey = key.value;
    } else if (types.isBinaryExpression(key)) {
      envKey = getLeaf(types, key);
      console.log(envKey);
    }
    // if (include && include.indexOf(envKey) !== -1) {
    //   path.replaceWith(types.valueToNode(process.env[envKey]));
    // }
  }
};

const getLeaf = (types, { left, right, operator }, result = '') => {
  if (types.isStringLiteral(left)) {
    result += left.value;
  } else if (types.isBinaryExpression(left)) {
    getLeaf(types, left, result);
  }

  if (operator === '+') {
    if (types.isStringLiteral(right)) {
      result += right.value;
    } else if (types.isBinaryExpression(right)) {
      getLeaf(types, right, result);
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
