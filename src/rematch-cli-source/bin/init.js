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
      require('../lib/init')(name, clearArgs(cmd))
    });
};
