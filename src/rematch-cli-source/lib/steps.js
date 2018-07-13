
module.exports = {
  sureDir: {
    name: 'sure',
    default: true,
    type: 'confirm',
    message: `是否是这个目录：`,
  },
  checkDir: {
    name: 'ok',
    default: true,
    type: 'confirm',
    message: `是否在当前目录创建react-rematch项目：`,
  },
  existDir: {
    name: 'exist',
    type: 'confirm',
    message: `当前目录已存在，是否替换：`,
  },
  author: {
    name: 'author',
    default: 'reactLover',
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
};
