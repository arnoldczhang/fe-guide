// babel-types
module.exports = function ({ types: t, template }) {
  return {
    name: "transform-diy",
    pre(file) {
    },
    visitor: {
      Program: {
        exit(path) {
          path.node.body.unshift(template(`const bb = require('./test');`)());
        }
      },
      Identifier: {
        enter(path) {
        },
        exit(path) {
          const { node } = path;
          const { name } = node;
          if (name === 'zzz') {
            console.log(path.parentPath.node.body);
          }

        },
      },

      BlockStatement(path) {
        // console.log('BlockStatement', path);
      },

      FunctionDeclaration(path) {
        // console.log('FunctionDeclaration', path);
      },
    },
    post(file) {

    },
  };
}