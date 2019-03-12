const { traverse, transformSync } = require('@babel/core');
const babelGenerator = require('@babel/generator').default;
const uglifyJS = require('uglify-js');

module.exports = () => {
  const input = `
    const obj = {
      ready: function() {
        if (ENV === 'tt') {
          //
        } else {
          aa.tryRun(function(){
            const self = this
            const query = self.createSelectorQuery()
            query.selectViewport().fields({
                size: true
            });
          });
        }
      },
    };
    obj.test(1);
  `;

  const { ast } = transformSync(input, {
    ast: true,
    code: false,
    sourceMap: true,
    babelrc: false,
    configFile: false,
    presets: ['@babel/env', 'minify'],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          "corejs": 2,
          "helpers": true,
          "regenerator": true,
          "useESModules": false
        }
      ],
      './src/babel/diy',
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