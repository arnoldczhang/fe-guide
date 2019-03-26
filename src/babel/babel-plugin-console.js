// https://www.npmjs.com/package/babel-plugin-console
const babel = require('babel-core');
const babelGenerator = require('babel-generator').default;
const fs = require('fs-extra');
const path = require('path');

module.exports = () => {
  const input = `
    const add100 = (a) => {
      const oneHundred = 100;
      console.scope('Add 100 to another number');
      return add(a, oneHundred);
    };
     
    const add = (a, b) => {
      return a + b;
    };
    add100(200);
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
      'console',
    ],
  });

  const { code: babelCode } = babelGenerator(ast, {
    minified: false,
  });
  fs.writeFileSync(path.join(__dirname, './test.js'), babelCode);
};
