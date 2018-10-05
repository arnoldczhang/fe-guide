const inquirer = require('inquirer');
const color = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { clearConsole } = require('./utils');
const question = require('./utils/question');
const execa = require('execa');
const { exec } = require('child_process');
const spawn = require('cross-spawn');

const {
  CODE,
} = steps;
const stdio = ['inherit', 'inherit', 'inherit'];
let context = '';

const run = (command, args = []) => {
  if (!args) {
    [command, ...args] = command.split(/\s+/);
  }

  return execa(command, args, {
    cwd: context,
    stdio,
  });
};