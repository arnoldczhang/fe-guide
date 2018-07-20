const inquirer = require('inquirer');
const color = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const deepmerge = require('deepmerge');

const { CODE } = require('./steps');
const { clearConsole } = require('./utils');

const stdio = ['inherit', 'inherit', 'inherit'];
let context = '';
let isInteractive = false;
let isFirstCompile = true;

const run = (command, args = []) => {
  if (!args) {
    [command, ...args] = command.split(/\s +/);
  }

  return execa(command, args, {
    cwd: context,
    stdio,
  });
};

const buildDllFile = async (path) => {
  console.log(color.green('start build the dll file...'));
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

        resolve();
      });
    });
  } catch (err) {
    console.log('✅', color.green('can`t find the dll config file, skip this step...'));
    resolve();
  }
};

const buildTsFiles = () => {

};

const runServer = async (path) => {
  try {
    const devConfig = require(`${path}/build/webpack.dev`);
    return new Promise((resolve, reject) => {
      const {
        output,
        plugins = [],
      } = devConfig;
      devConfig.mode = 'development';
      plugins.push(
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
      );

      console.log(color.green('Starting compile the dev config...'));
      const compiler = webpack(devConfig);
      let devServerConfig = require('./server.config')({
        path: output.path || `${path}/dist`,
      });
      const { host, port } = devServerConfig;
      devServerConfig = deepmerge(devServerConfig, devConfig.devServer || {});
      const server = new WebpackDevServer(compiler, devServerConfig);

      compiler.plugin('done', (stats) => {
        if (isInteractive) {
          clearConsole();
        }

        if (isFirstCompile) {
          isFirstCompile = false;
          console.log(color.green('Starting the development server...'));
        }

        console.log(
          stats.toString({
            colors: true,
            chunks: false,
            assets: true,
            children: false,
            modules: false,
          })
        );

        const json = stats.toJson({}, true);
        const messages = formatWebpackMessages(json);
        const isSuccessful = !messages.errors.length && !messages.warnings.length;

        if (isSuccessful) {
          if (stats.stats) {
            console.log(color.green('dev config Compiled successfully'));
          } else {
            console.log(color.green(`Compiled successfully in ${(json.time / 1000).toFixed(1)}s!`));
          }
        }

        if (messages.errors.length) {
          if (messages.errors.length > 1) {
            messages.errors.length = 1;
          }
          console.log(color.red('Failed to compile.\n'));
          console.log(messages.errors.join('\n\n'));
        } else if (messages.warnings.length) {
          console.log(color.yellow('Compiled with warnings.'));
          console.log();
          messages.warnings.forEach((message) => {
            console.log(message);
            console.log();
          });
          console.log();
        }
      });

      compiler.plugin('invalid', () => {
        if (isInteractive) {
          clearConsole();
        }
        console.log('Compiling...');
      });

      server.use((req, res, next) => {
        console.log('Time:', Date.now());
        next();
      });

      server.listen(port, host, (err) => {
        // 端口被占用，退出程序
        if (err) {
          console.error(err);
          reject();
          process.exit(500);
        }
        console.log('✅', color.green(`server start at ${host}:${port} ...`));
        resolve();
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
    await buildTsFiles(path);
  }

  if (mode === CODE.DEV) {
    await runServer(path);
  }
};

// test
// build('aa');
module.exports = build;
