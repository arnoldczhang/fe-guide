const { declare } = require('@babel/helper-plugin-utils');
const template = require('@babel/template').default;

/************plugins*************/
/**
 * self/this/xxx.createSelectorQuery -> tt.createSelectorQuery
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function replaceCreateSelectorQuery(path) {
  const { node, parent } = path;
  const { name } = node;
  if (name === 'createSelectorQuery') {
    const { type } = parent.object;
    if (type === 'Identifier') {
      parent.object.name = 'tt';
    }
  }
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
      },

      VariableDeclarator(path) {
      },

      FunctionDeclaration(path) {
      },
    },
    post(file) {
    },
  };
});
