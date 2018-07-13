'use strict';

const EventEmitter = require('events');
const inquirer = require('inquirer');
const color = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { clearConsole } = require('./utils');
const steps = require('./steps');
const execa = require('execa');

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

const insertCode = async (dir, args) => {
  const codeDir = path.resolve(__dirname, './code');
  const rematchDir = path.resolve(codeDir, './rematch');
  context = dir;
  console.log(color.green(dir));
  const { sure } = await inquirer.prompt([steps.sureDir]);
  if (!sure) {
    console.log(color.green('退出...'));
    process.exit(1);
    return;
  }
  await copyConfigFiles(dir, codeDir, args);
  await clearConsole();
  await copyReactFiles(dir, rematchDir, args);
  await initGitRepo();
  await installPackage();
};

const copyConfigFiles = async (targetDir, codeDir, args) => {
  const projectName = /\/([^\/]+)$/.exec(targetDir)[1];
  const packageJsonDir = path.resolve(codeDir, './config/package.json');
  const { author } = args.author ? args : await inquirer.prompt([steps.author]);
  const { version } = args.version ? args : await inquirer.prompt([steps.version]);
  const { description } = args.description ? args : await inquirer.prompt([steps.description]);
  let { keywords } = args.keywords ? args : await inquirer.prompt([steps.keywords]);
  keywords = keywords.split(',');

  let packageContent = fs.readFileSync(packageJsonDir, 'utf8');
  packageContent = packageContent.replace(/\$author/, author)
    .replace(/\$projectName/, projectName)
    .replace(/\$version/, version)
    .replace(/\$description/, description)
    .replace(/"\$keywords"/, JSON.stringify(keywords));

  if (packageContent) {
    fs.writeFileSync(path.resolve(codeDir, './rematch/package.json'), packageContent);
    console.log('✅', color.green('configuring the package.json SUCCESS...'));
  }
};

const copyReactFiles = async (targetDir, rematchDir) => {
  await fs.copy(rematchDir, targetDir, (err) => {
    if (err) {
      console.log(color.red(err));
      console.log('❌', color.green(`creating project in ${targetDir} FAIL...`));
      process.exit(1);
    } else {
      console.log('✅', color.green(`creating project in ${targetDir} SUCCESS...`));
    }
  });
};

const initGitRepo = async () => {
  try {
    await run('git', ['status']);
    await run('git', ['init']);
    console.log('✅', color.green('configuring the git SUCCESS...'));
  } catch (err) {
    console.log('❌', color.green('configuring the git FAIL...'));
    console.log('❌', color.green('please init the git yourself...'));
    console.log(color.red(err.message));
  }
};

const installPackage = async () => {
  console.log('✅', color.green('installing the node_modules...'));
  return new Promise(async (resolve, reject) => {
    try {
      const child = await run('npm', ['install']);

      if (child.stdout) {
        child.stdout.on('data', (buffer) => {
          process.stdout.write(buffer);
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (buffer) => {
          const str = buffer.toString();
          if (/warn/i.test(str)) {
            return false;
          }
        });
      }

      child.on('close', (code) => {
        if (code !== 0) {
          return reject();
        }
        console.log('✅', color.green('installing the node_modules SUCCESS...'));
        resolve();
      });
    } catch (err) {
      console.log(color.red(JSON.stringify(err)));
      console.log('❌', color.green('installing the node_modules FAIL...'));
      console.log('❌', color.green('please install node_modules yourself...'));
      resolve();
    }
  });
};

module.exports = async (projectName, args) => {
  await clearConsole();
  const targetDir = path.resolve(process.cwd(), projectName || '.');
  const { ok } = await inquirer.prompt([steps.checkDir]);
  if (ok) {
    if (fs.existsSync(targetDir)) {
      const { exist } = await inquirer.prompt([steps.existDir]);
      if (exist) {
        await fs.remove(targetDir);
        insertCode(targetDir, args);
      } else {
        console.log(color.green('退出...'));
        process.exit(1);
      }
    } else {
      insertCode(targetDir, args);
    }
  } else {
    console.log(color.green('退出...'));
    process.exit(1);
  }
};
