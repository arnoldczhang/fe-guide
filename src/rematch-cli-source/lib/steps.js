const exec = require('child_process').execSync;
let name = exec('git config --get user.name');
let email = exec('git config --get user.email');
name = name && JSON.stringify(name.toString().trim()).slice(1, -1);
email = email && ' <' + email.toString().trim() + '>';

const CODE = {
  TYPESCRIPT: 'typescript',
  ESLINT: 'eslint',
  DEV: 'development',
  TS: 'TYPESCRIPT',
};

module.exports = {
  CODE,
  sureDir: {
    name: 'sure',
    default: true,
    type: 'confirm',
    message: '是否是这个目录：',
  },
  checkDir: {
    name: 'ok',
    default: true,
    type: 'confirm',
    message: '是否在当前目录创建react-rematch项目：',
  },
  existDir: {
    name: 'exist',
    type: 'confirm',
    message: '当前目录已存在，是否替换：',
  },
  author: {
    name: 'author',
    default: (`${name}${email}`) || 'reactLover',
    type: 'input',
    message: '作者：',
  },
  version: {
    name: 'version',
    default: '1.0.0',
    type: 'input',
    message: '版本：',
  },
  keywords: {
    name: 'keywords',
    default: 'react-rematch',
    type: 'input',
    message: '关键字（用","分割）：',
  },
  description: {
    name: 'description',
    default: 'react-rematch',
    type: 'input',
    message: '描述：',
  },
  git: {
    name: 'git',
    default: true,
    type: 'confirm',
    message: '是否在项目目录`git init`',
  },
  npmI: {
    name: 'npmI',
    default: true,
    type: 'confirm',
    message: '是否在项目目录`npm install`',
  },
  plugins: {
    name: 'plugins',
    default: '',
    type: 'checkbox',
    choices: [
      { name: 'typescript', value: CODE.TYPESCRIPT },
      { name: 'eslint', value: CODE.ESLINT },
    ],
    message: '配置：',
  },
};
