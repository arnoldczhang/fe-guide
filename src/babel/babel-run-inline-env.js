const { traverse, transformSync } = require('@babel/core');
const babelGenerator = require('@babel/generator').default;
const uglifyJS = require('uglify-js');

module.exports = () => {
  const input = `
    const env = 'NODE_ENV';

    if (process.env.NODE_ENV === 'production') {
      console.log(1);
    }

    if (process.env['NO' + 'DE' + '_ENV'] === 'production') {
      console.log(2);
    }

    if (process.env[env] === 'production') {
      console.log(3);
    }

    if (process.env[env + ''] === 'production') {
      console.log(4);
    }

    if (process.env['' + env + ''] === 'production') {
      console.log(5);
    }
  `;

  const { ast } = transformSync(input, {
    ast: true,
    code: false,
    sourceMap: true,
    babelrc: false,
    configFile: false,
    presets: ['@babel/env', 'minify'],
    plugins: [
      ['./src/babel/babel-plugin-inline-env', {
        include: ['NODE_ENV'],
      }],
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