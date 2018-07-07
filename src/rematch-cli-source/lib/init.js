'use strict';

const inquirer = require('inquirer');
const color = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { clearConsole } = require('./utils');
const steps = require('./steps');

const insertCode = async (dir, args) => {
  const codeDir = path.resolve(__dirname, './code');
  const { author } = args.author ? args : await inquirer.prompt([steps.author]);
  const { version } = args.version ? args : await inquirer.prompt([steps.version]);
  const { description } = args.description ? args : await inquirer.prompt([steps.description]);
  let { keywords } = args.keywords ? args : await inquirer.prompt([steps.keywords]);
  keywords = keywords.split(',');
  await fs.copy(codeDir, dir, (err) => {
    if (err) {
      console.log(color.red(JSON.stringify(err)));
      process.exit(1);
    }
  });
};

module.exports = async (projectName, args) => {
  await clearConsole();
  const targetDir = path.resolve(projectName || '.');
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
