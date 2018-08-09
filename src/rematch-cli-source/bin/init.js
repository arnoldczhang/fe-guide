#!/usr/bin/env node

'use strict';

const { clearArgs } = require('../lib/utils');

module.exports = (program, packageInfo) => {
  program
    .command('create <project-name>')
    .allowUnknownOption()
    .description('create a new project powered by cli')
    .option('-p, --port <port>', 'server port')
    .option('-k, --keyword <keyword>', 'keyword')
    .option('-a, --author <author>', 'author')
    .option('-d, --decription <decription>', 'decription')
    .action((name, cmd) => {
      require('../lib/init')(name, clearArgs(cmd));
    });

  program
    .command('build')
    .allowUnknownOption()
    .description('build project powered by cli')
    .option('-p, --path <path>', 'enter build path')
    .option('-f, --file <file>', 'select entrance file')
    .option('-m, --mode <mode>', 'choose build mode')
    .option('-t, --type <type>', 'use typescript')
    .action((cmd) => {
      require('../lib/build')(cmd);
    });
};
