const { traverse, transformSync } = require('@babel/core');
const babelGenerator = require('@babel/generator').default;
const uglifyJS = require('uglify-js');

const run = () => {
  const input = `
    const promise = new Promise((resolve) => {
      resolve(1);
    });
  `;

  const { ast } = transformSync(input, {
    ast: true,
    code: false,
    sourceMap: true,
    babelrc: false,
    configFile: false,
    presets: [
      ['@babel/env', {
        useBuiltIns: "usage",
      }],
      'minify',
    ],
    plugins: [
    ],
  });

  traverse(ast, {
    CallExpression({ node }) {

    },
    VariableDeclarator({ node }) {

    },
  });

  const { code: babelCode } = babelGenerator(ast, {
    minified: false,
  });

  const { error, code } = uglifyJS.minify(babelCode, {
    output: {},
    compress: {
      dead_code: true,
      global_defs: {
        ENV: 'tt',
      }
    },
    mangle: {
      toplevel: false,
    },
  });

  console.log(code);
};

run();

module.exports = run;