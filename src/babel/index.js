const babel = require('babel-core');
const babelTraverse = require("babel-traverse").default;
const babelGenerator = require('babel-generator').default;
const uglifyJS = require('uglify-js');

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
`;

const { ast, metadata } = babel.transform(input, {
  sourceMap: true,
  env: {
  },
  presets: ["es2015", "stage-0"],
  plugins: [
    [
      "transform-runtime",
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
babelTraverse(ast, {
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