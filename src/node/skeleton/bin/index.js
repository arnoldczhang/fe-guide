#!/usr/bin/env node

const program = require('commander');
const UpdateNotifier = require('update-notifier').UpdateNotifier;
const semCmp = require('semver-compare');
const color = require('chalk');
const boxen = require('boxen');
const {
  resolve,
} = require('path');
const {
  join
} = require('path');
const {
  readFileSync
} = require('fs');
const chokidar = require('chokidar');

const run = require('../dist/index.cjs');
const cfg = require('../package.json');
const options = {
  root: process.cwd(),
};
const thisDir = process.cwd();
const {
  defaultConfigName,
} = run;


// 更新检查方法
const notifier = new UpdateNotifier({
  pkg: cfg,
  callback(err, result) {
    if (err) return;
    if (semCmp(result.latest, result.current) > 0) {
      const message =
        'Update available ' +
        color.dim(result.current) +
        color.reset(' → ') +
        color.green(result.latest) +
        ' \nRun ' +
        color.cyan('npm i -g ' + json.name) +
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
  configFn();
  run(options);
  console.log('compile done');
};

const configFn = (filePath = defaultConfigName) => {
  let configFile;
  filePath = filePath || defaultConfigName;
  const absPath = join(thisDir, filePath);
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
};

program
  .version(cfg.version)
  .usage('[options] <appRoot>')
  .option('--ignore <tags>', 'ast解析wxml时忽略指定标签')
  .option('-c, --config <dir>', '指定读取配置文件，默认/skeleton.config.js')
  .option('-u, --checkUpdate', '检查更新版本')
  .option('-p, --page <pages>', '仅生成指定页的骨架图，默认*')
  .option('-t, --treeshake', '启用wxss摇树，默认不启用，注：可能存在样式缺少的风险')
  .option('-i, --inputDir <dir>', '指定输入目录，默认/src')
  .option('-o, --outDir <dir>', '指定输出目录，默认/src/skeleton')
  .option('-w, --watch', '监听指定输入')
  .parse(process.argv);

ifArg('checkUpdate', () => {
  notifier.check();
});

ifArg('treeshake', () => {
  options.treeshake = true;
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


ifArg('config', configFn, init);

ifArg('watch', () => {
  console.log('watch skeleton changes...');
  options.watch = true;
  chokidar.watch(resolve(options.root, options.inputDir || './src'), {
      ignored: /\/skeleton\/.*/
    })
    .on('change', init);
});
