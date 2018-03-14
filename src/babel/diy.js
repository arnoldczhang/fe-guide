module.exports = function (ref) {
  console.log(ref);
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name;
        // console.log(name);
      },

      BlockStatement(path) {
        // console.log(path);
      },

      FunctionDeclaration(path) {
        // console.log()
      },
    }
  };
}