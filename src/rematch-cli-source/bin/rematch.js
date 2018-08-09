#!/usr/bin/env node

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Arnold.Zhang
*/
'use strict';

const program = require('commander');
const packageInfo = require('../package.json');
const injectInitCommand = require('./init.js');
const colors = require('chalk');

const proc = program.runningCommand;

program
  .version(packageInfo.version)
  .usage('<command> [options]')

injectInitCommand(program, packageInfo);
program.commands.forEach(c => c.on('--help', () => console.log()));
program.parse(process.argv);

if (proc) {
  proc.on('close', process.exit.bind(process));
  proc.on('error', () => {
    process.exit(1);
  });
}

const subCmd = program.rawArgs[2];

if (!subCmd || (subCmd !== 'build' && subCmd !== 'create')) {
  program.help();
}
