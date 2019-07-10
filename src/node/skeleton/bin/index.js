#!/usr/bin/env node

const program = require('commander');
const UpdateNotifier = require('update-notifier').UpdateNotifier;
const semCmp = require('semver-compare');
const chalk = require('chalk');
const boxen = require('boxen');
const {
  join
} = require('path');
const {
  readFileSync
} = require('fs');

const run = require('../dist/index.cjs');
const cfg = require('../package.json');
const options = {};
const thisDir = process.cwd();
const {
  defaultConfigName,
} = run;


// 更新检查方法
const notifier = new UpdateNotifier({
  pkg: cfg,
  callback: function (err, result) {
    if (err) return;
    if (semCmp(result.latest, result.current) > 0) {
      const message =
        'Update available ' +
        chalk.dim(result.current) +
        chalk.reset(' → ') +
        chalk.green(result.latest) +
        ' \nRun ' +
        chalk.cyan('npm i -g ' + json.name) +
        ' to update';
      const msg =
        '\n' +
        boxen(message, {
          padding: 1,
          margin: 1,
          align: 'center',
          borderColor: 'yellow',
          borderStyle: 'round'
        });
      console.log(msg);
    }
  }
});

const ifArg = (name, fn, init) => {
  let optionValue = program[name];
  if (optionValue) {
    if (/,/.test(optionValue)) {
      optionValue = optionValue.split(',');
    }
    fn(optionValue);
  }
  if (init) init();
};

const init = () => {
  options.root = process.cwd();
  run(options);
};

program
  .version(cfg.version)
  .usage('[options] <appRoot>')
  .option('--ignore <tags>', 'ast解析wxml时忽略指定标签')
  .option('-c, --config <dir>', '指定读取配置文件，默认/skeleton.config.js')
  .option('-u, --checkUpdate', '检查更新版本')
  .option('-p, --page <pages>', '仅生成指定页的骨架图，默认*')
  .option('-i, --inputDir <dir>', '指定输入目录，默认/src')
  .option('-o, --outDir <dir>', '指定输出目录，默认/src/skeleton')
  .parse(process.argv);

ifArg('checkUpdate', () => {
  notifier.check();
});

ifArg('page', (pages) => {
  options.page = pages;
});

ifArg('ignore', (tags) => {
  options.ignore = tags;
});

ifArg('inputDir', (dir) => {
  options.inputDir = dir;
});

ifArg('outDir', (dir) => {
  options.outDir = dir;
});

ifArg('config', (filePath) => {
  let configFile;
  const absPath = join(thisDir, filePath || defaultConfigName);
  if (/\.json$/.test(filePath)) {
    configFile = JSON.parse(readFileSync(absPath, 'utf-8'));
  } else if (/\.js$/.test(filePath)) {
    try {
      configFile = require(absPath);
    } catch (err) {
      console.warn('未找到配置文件');
      configFile = {};
    }
  } else {
    return console.warn('仅支持json或js');
  }

  if (typeof configFile === 'function') {
    configFile = configFile();
  }
  Object.assign(options, configFile);
}, init);
