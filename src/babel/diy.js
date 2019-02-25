module.exports = function (ref) {
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name === 'wx') {
          path.node.name = "tt";
        }
      },

      BlockStatement(path) {
        // console.log('BlockStatement', path);
      },

      FunctionDeclaration(path) {
        // console.log('FunctionDeclaration', path);
      },
    }
  };
}