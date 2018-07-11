'use strict';

const EventEmitter = require('events');
const inquirer = require('inquirer');
const color = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { clearConsole } = require('./utils');
const steps = require('./steps');
const exec = require('child_process').exec;
const execa = require('execa');

let context = '';

const run = (command, cb, args = {}) => {
  cb = cb || (v => v);
  return exec(command, {
    cwd: args.context || context,
  }, cb);
};

const insertCode = async (dir, args) => {
  const codeDir = path.resolve(__dirname, './code');
  await copyConfigFiles(dir, codeDir, args);
  await clearConsole();
  console.log('⚙', color.green('configuring the package.json SUCCESS...'));
  await initGitRepo();
  console.log('🗃', color.green('configuring the git SUCCESS...'));
  await copyReactFiles(dir, codeDir, args);
  console.log('⚙', color.green(`creating project in ${dir} SUCCESS...`));
  await installPackage(dir);
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
    .replace(/"\$keywords"/, JSON.stringify(keywords))
    ;

  if (packageContent) {
    fs.writeFileSync(path.resolve(codeDir, './rematch/package.json'), packageContent);
  }
};

const copyReactFiles = async (targetDir, codeDir) => {
  const rematchDir = path.resolve(codeDir, './rematch');
  context = rematchDir;
  await fs.copy(rematchDir, targetDir, (err) => {
    if (err) {
      console.log(color.red(err));
      process.exit(1);
    }
  });
};

const initGitRepo = async () => {
  try {
    await run('git status');    
    await run('git init', (err, stdout, stderr) => {
      if (err) {
        console.log(color.red(err));
        process.exit(1);
      }
    });
    console.log('🗃', color.green('initializing git repository SUCCESS...'));
  } catch (err) {
    console.log(color.red(err.message));
    process.exit(1);
  }
};

const installPackage = async (targetDir) => {
  console.log('⚙', color.green('installing the packages...'));
  // console.log(context);
  return new Promise((resolve, reject) => {
    const child = run('npm install --loglevel error', (err) => {
      if (err) {
        console.log(color.red(err));
        process.exit(1);
      }
      console.log(color.green('installing package SUCCESS...'));
    });

    child.stdout.on('data', buffer => {
      process.stdout.write(buffer)
    });

    child.on('close', code => {
      if (code !== 0) {
        reject(`command failed: ${command} ${args.join(' ')}`);
        return;
      }
      resolve();
    });
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

//   const { action } = await inquirer.prompt([
//     {
//       name: 'action',
//       type: 'list',
//       message: `Target directory ${color.cyan('a')} already exists. Pick an action:`,
//       choices: [
//         { name: 'Overwrite', value: 'overwrite' },
//         { name: 'Merge', value: 'merge' },
//         { name: 'Cancel', value: false }
//       ]
//     }
//   ]);

// const { features } = await inquirer.prompt([
//     {
//       name: 'features',
//       type: 'checkbox',
//       message: `Target directory ${color.cyan('a')} already exists. Pick an action:`,
//       choices: [
//         { name: 'Overwrite', value: 'overwrite' },
//         { name: 'Merge', value: 'merge' },
//         { name: 'Cancel', value: false }
//       ]
//     }
//   ]);  
};
