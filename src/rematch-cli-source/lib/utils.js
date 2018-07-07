const readline = require('readline');

const clearArgs = (cmd) => {
  const args = {};
  (cmd.options || []).forEach(o => {
    const key = o.long.replace(/^--/, '');
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function') {
      args[key] = cmd[key];
    }
  });
  return args;
};

const clearConsole = (title) => {
if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    if (title) {
      console.log(title);
    }
  }
};

module.exports = {
  clearArgs,
  clearConsole,
};
