const babelConsole = require('./babel-plugin-console');
const babelMacro = require('./babel-plugin-macro');
const babel7Diy = require('./babel-plugin-diy');

const runMap = {
  babel7Diy,
  babelConsole,
  babelMacro,
};

/**
 * run task
 */
const run = () => {
  const method = process.argv[2];
  const func = runMap[method];
  if (typeof func === 'function') {
    func();
  }
};

run();
