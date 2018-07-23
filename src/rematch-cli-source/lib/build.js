const color = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const serve = require('webpack-serve');
const spawn = require('cross-spawn');
const open = require('opn');

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
    const devServer = config.devServer || {};
    const {
      port = 8080,
      host = 'localhost'
    } = devServer;
    return Promise.resolve().then(() => {
      return serve({
        config,
        host,
        port,
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
      server.on('listening', () => {
        open(`http://${host}:${port}`);
      });
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
  if (type === CODE.TS) {
    buildTsFiles(path);
  }

  if (mode === CODE.DEV) {
    await runServer(path);
  }
};

// test
// build('aa');
module.exports = build;
