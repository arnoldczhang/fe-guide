const color = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const serve = require('webpack-serve');
const spawn = require('cross-spawn');

const { CODE } = require('./steps');
const { clearConsole } = require('./utils');

const buildDllFile = async (path) => {
  console.log(color.green('Start compiling the dll file...'));
  try {
    const dllFile = require(`${path}/build/webpack.dll.config.js`);
    return new Promise((resolve, reject) => {
      webpack(dllFile, (err, stats) => {
        if (err) {
          console.log(err);
          reject();
        }

        if (stats.hasErrors()) {
          reject(new Error('webpack compiled failed.'));
        }

        console.log(color.green('Dll file is compiled...'));
        resolve();
      });
    });
  } catch (err) {
    console.log('✅', color.green('can`t find the dll config file, skip this step...'));
    resolve();
  }
};

const buildTsFiles = (path) => {
  spawn('tsc', ['-w'], { cwd: path });
  console.log(color.green('Watching the ts files transfer...'));
};

const runServer = async (path) => {
  try {
    let devConfig = require(`${path}/build/webpack.dev`);
    const config = require('./server.config')(devConfig);
    return Promise.resolve().then(() => {
      return serve({
        config,
        dev: {
          stats: {
            colors: true,
            chunks: false,
            children: false,
            entrypoints: false,
            chunkModules: false,
            source: false,
            cachedAssets: false,
            cached: false,
            chunkOrigins: false,
            modules: false,
            builtAt: false,
          },
        },
      });
    }).then((server) => {
      server.on('listening', () => {});
    });
  } catch (err) {
    console.log('❌', color.green(JSON.stringify(err)));
    process.exit(1);
  }
};

const build = async ({
  file = './src/index',
  mode = CODE.DEV,
  type = CODE.TS,
  path = process.cwd(),
}) => {
  await buildDllFile(path);
  buildTsFiles(path);
  if (type === CODE.TS) {
  }

  if (mode === CODE.DEV) {
    await runServer(path);
  }
};

// test
// build('aa');
module.exports = build;
