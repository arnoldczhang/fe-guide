// babel-types
module.exports = function ({ types: t }) {
  return {
    name: "transform-diy",
    pre(file) {
      // console.log(this);
    },
    visitor: {
      Identifier: {
        enter(path) {
          const { node } = path;
          const { name } = node;
          if (name === 'n') {
            console.log(path.get('n'));
            path.replaceWithSourceString('tt');
          }
        },
        exit() {

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