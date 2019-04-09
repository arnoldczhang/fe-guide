const { parse } = require('acorn');
const { traverse, transformSync } = require('@babel/core');
const babelGenerator = require('@babel/generator').default;
const astTraverse = require("ast-traverse");
const alter = require("alter");

const codeStr = `
  let a = 123;
  let b, c = 'abc';
  function aa () {};
`;



/**
 * acorn编译
 * @type {Array}
 */
const ctx = [];

function diyTransform(node, result = '') {
  const { type } = node;
  switch (type) {
    case 'VariableDeclaration':
      const { kind, declarations } = node;
      result = kind + ' ';
      return `${kind} ${declarations.map(diyTransform).join()};`;
    case 'VariableDeclarator':
      const { id, init } = node;
      return `${diyTransform(id)}${init ? ` = ${diyTransform(init)}` : ''}`;
    case 'Identifier':
      const { name } = node;
      return name;
    case 'Literal':
      const { raw = '' } = node;
      return raw;
  }
};

const ast = parse(codeStr);

astTraverse(ast, {
  pre(node) {
    const { type, start, end } = node;
    switch (type) {
      case 'VariableDeclaration':
        node.kind = 'var';
        ctx.push({
          start,
          end,
          str: diyTransform(node),
        });
        break;
      default:
        break;
    }
  },
});
console.log(alter(codeStr, ctx));

/**
 * babel编译
 * @type {[type]}
 */
const { ast: babelAst } = transformSync(codeStr, {
  ast: true,
  code: false,
  sourceMap: true,
  babelrc: false,
  configFile: false,
  presets: ['@babel/env'],
});

traverse(babelAst, {
  VariableDeclarator(path) {
    // ...
  },
});
console.log(babelGenerator(babelAst, {
  minified: false,
}).code);