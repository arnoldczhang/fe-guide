
module.exports = {
  checkDir: {
    name: 'ok',
    default: true,
    type: 'confirm',
    message: `是否在当前目录创建react-rematch项目：`
  },
  existDir: {
    name: 'exist',
    type: 'confirm',
    message: `当前目录已存在，是否替换：`
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
  keyword: {
    name: 'keyword',
    default: 'react-rematch',
    type: 'input',
    message: '关键字：',
  },
};
