const babel = require('babel-core');
const { transform, transformAsync, transformSync } = require('@babel/core');
const babelGenerator = require('babel-generator').default;
const fs = require('fs-extra');
const path = require('path');

const run = () => {
  const input = `
    import scope from 'scope.macro'
    import ms from 'ms.macro'
    function add100(a) {
      const oneHundred = 100
      scope('Add 100 to another number')
      const ONE_DAY = ms('1 day');
      const TWO_DAYS = ms('2 days');
      return add(a, oneHundred)
    }

    function add(a, b) {
      return a + b
    }
    add100(20220);
  `;

  const { ast } = babel.transform(input, {
    sourceMap: true,
    env: {},
    presets: ['es2015'],
    plugins: [
      [
        'transform-runtime',
        {
          "corejs": 2,
          "helpers": true,
          "regenerator": true,
          "useESModules": false
        }
      ],
      'macros',
    ],
  });


  const { ast } = transformSync(input, {
    ast: true,
    code: false,
    sourceMap: true,
    babelrc: false,
    configFile: false,
    presets: ['@babel/env'],
    filename: 'unknown',
    plugins: [
      'macros',
    ],
  });

  const { code: babelCode } = babelGenerator(ast, {
    minified: false,
  });
  fs.writeFileSync(path.join(__dirname, './test.js'), babelCode);
};

module.exports = run;

run();
