// babel-types

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

module.exports = function ({ types: t, template }) {
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

      FunctionDeclaration(path) {
      },
    },
    post(file) {

    },
  };
}