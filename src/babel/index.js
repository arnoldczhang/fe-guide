const babelConsole = require('./babel-plugin-console');
const babelMacro = require('./babel-plugin-macro');
const babel7Diy = require('./babel-run-diy');
const babelInlineEnv = require('./babel-run-inline-env');

const runMap = {
  babel7Diy,
  babelConsole,
  babelMacro,
  babelInlineEnv,
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
