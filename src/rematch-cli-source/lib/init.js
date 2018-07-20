const inquirer = require('inquirer');
const color = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { clearConsole } = require('./utils');
const steps = require('./steps');
const execa = require('execa');

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
    console.log('✅', color.green('configuring the package.json SUCCESS...'));
  }
  return path.resolve(codeDir, `./${pkgDirName}`);
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
    // console.log(color.red(err.message));
    // console.log('❌', color.green('configuring the git FAIL...'));
    console.log('✅', color.green('please init the git yourself...'));
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
        return resolve();
      });
    } catch (err) {
      // console.log(color.red(JSON.stringify(err)));
      // console.log('❌', color.green('installing the node_modules FAIL...'));
      console.log('✅', color.green('please install node_modules yourself...'));
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
    console.log(color.green('退出...'));
    process.exit(1);
    return;
  }
  const { plugins } = await inquirer.prompt([steps.plugins]);
  const rematchDir = await copyConfigFiles(dir, codeDir, plugins, args);
  await clearConsole();
  await copyReactFiles(dir, rematchDir, args);
  await initGitRepo();
  await installPackage();
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
        console.log(color.green('退出...'));
        process.exit(1);
      }
    } else {
      insertCode(targetDir, projectName, args);
    }
  } else {
    console.log(color.green('退出...'));
    process.exit(1);
  }
};

// test
// init('aa');
module.exports = init;
