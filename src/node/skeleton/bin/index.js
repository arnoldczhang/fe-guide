#!/usr/bin/env node

const program = require('commander');
const {
  join
} = require('path');
const {
  readFileSync
} = require('fs');
const run = require('../dist/index.cjs');
const {
  defaultConfigName,
} = run;
const cfg = require('../package.json');
const options = {};
const thisDir = process.cwd();

const ifArg = (name, fn, init) => {
  let optionValue = program[name];
  if (optionValue) {
    if (/,/.test(optionValue)) {
      optionValue = optionValue.split(',');
    }
    fn(optionValue);
    if (init) init();
  }
};

const init = () => {
  options.root = process.cwd();
  run(options);
};

program
  .version(cfg.version)
  .usage('[options] <appRoot>')
  .option('--ignore <tags>', 'ast解析wxml时忽略指定标签，逗号分割')
  .option('-c, --config <dir>', '指定读取配置文件，默认/skeleton.config.js')
  .option('-i, --inputDir <dir>', '指定输入目录，默认/src')
  .option('-o, --outDir <dir>', '指定输出目录，默认/src/skeleton')
  .parse(process.argv);

ifArg('ignore', (tags) => {
  options.ignoreTags = tags;
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
