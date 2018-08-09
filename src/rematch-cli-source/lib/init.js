const inquirer = require('inquirer');
const color = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { clearConsole } = require('./utils');
const steps = require('./steps');
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

const copyConfigFiles = async (targetDir, codeDir, plugins, args) => {
  const projectName = /\/([^\/]+)$/.exec(targetDir)[1];
  let pkgDirName = 'rematch';
  if (plugins.indexOf(CODE.TYPESCRIPT) > -1) {
    pkgDirName = CODE.TYPESCRIPT;
  }
  const packageJsonDir = path.resolve(codeDir, `./config/${pkgDirName}/package.json`);
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
    fs.writeFileSync(path.resolve(codeDir, `./${pkgDirName}/package.json`), packageContent);
    console.log('✅', color.green('Configuring the package.json SUCCESS...'));
  }
  return path.resolve(codeDir, `./${pkgDirName}`);
};

const copyReactFiles = (targetDir, rematchDir, cb) => {
  fs.copy(rematchDir, targetDir, (err) => {
    if (err) {
      console.log(color.red(err));
      console.log('❌', color.green(`Creating project in ${targetDir} FAIL...`));
      process.exit(1);
    } else {
      console.log('✅', color.green(`Creating project in ${targetDir} SUCCESS...`));
      cb(targetDir);
    }
  });
};

const initGitRepo = async () => {
  const { git } = await inquirer.prompt([steps.git]);
  if (!git) return;
  try {
    await run('git', ['status']);
    await run('git', ['init']);
    console.log('✅', color.green('Configuring the git SUCCESS...'));
  } catch (err) {
    // console.log(color.red(err.message));
    console.log('❌', color.green('Configuring the git FAIL...'));
    console.log('✅', color.green('Please init the git yourself...'));
  }
};

const installPackage = async () => {
  const { npmI } = await inquirer.prompt([steps.npmI]);
  if (!npmI) return console.log(color.red('REMEMBER:'), 'You have to run `npm install` manually before running `npm start`');
  console.log('✅', color.green('Installing the node_modules...'));
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
        console.log('✅', color.green('Installing the node_modules SUCCESS...'));
        resolve();
      });
    } catch (err) {
      // console.log(color.red(JSON.stringify(err)));
      // console.log('❌', color.green('Installing the node_modules FAIL...'));
      console.log('✅', color.green('Something happened,  you may need to install node_modules manually...'));
      resolve();
    }
  });
};

const insertCode = async (dir, projectName, args) => {
  const codeDir = path.resolve(__dirname, './code');
  context = dir;
  console.log(color.green(dir));
  const { sure } = await inquirer.prompt([steps.sureDir]);
  if (!sure) {
    console.log(color.green('quit...'));
    process.exit(1);
    return;
  }
  const { plugins } = await inquirer.prompt([steps.plugins]);
  const rematchDir = await copyConfigFiles(dir, codeDir, plugins, args);
  await clearConsole();
  copyReactFiles(dir, rematchDir, async () => {
    await initGitRepo();
    await installPackage();
  });
};

const init = async (projectName, args) => {
  await clearConsole();
  const targetDir = path.resolve(process.cwd(), projectName || '.');
  const { ok } = await inquirer.prompt([steps.checkDir]);
  if (ok) {
    if (fs.existsSync(targetDir)) {
      const { exist } = await inquirer.prompt([steps.existDir]);
      if (exist) {
        await fs.remove(targetDir);
        insertCode(targetDir, projectName, args);
      } else {
        console.log(color.green('quit...'));
        process.exit(1);
      }
    } else {
      insertCode(targetDir, projectName, args);
    }
  } else {
    console.log(color.green('quit...'));
    process.exit(1);
  }
};

module.exports = init;

// test
// init('aa');
