/* eslint-disable */
const path = require('path');
const base64Img = require('base64-img');
const loaderUtils = require('loader-utils');
const color = require('chalk');
const signale = require('signale');

console.warn = signale.warn;

const {
  compressFile,
  removeEmptyLine,
  CONST,
} = require('./utils');

const {
  SRC,
  DEST,
} = CONST;

const commentImport = (input = '') => input.replace(/(@import[^;\r\n\t]+;)/g, '/*$1*/');
const unCommentImport = (input = '') => input.replace(/\/\*(@import[^;\r\n\t]+;)\*\//g, '$1');

const img2Base64 = (
  input = '',
  {
    srcName = SRC,
    destName = DEST,
  },
  resource,
) => (
  input.replace(/(?:\.\/|)b64-{3}(.+)(-{3}|'|"\))/g, (match, $1, $2) => {
    let imageData;
    const separate = $2 !== '---' ? $2 : '';
    const isRelativePath = /^\.{1,2}\//.test($1);
    const imagePath = $1.replace(/-{3}$/, '');

    const absolutePath = isRelativePath
      ? path.join(resource, '../', imagePath)
      : path.join(__dirname, `..${srcName}`, imagePath);
    try {
      imageData = base64Img.base64Sync(absolutePath.replace(srcName || '', destName || ''));
    } catch (err) {
      console.warn(color.yellow(`${absolutePath} is not found or has exception`));
      return `${separate}`;
    }
    return `${imageData}${separate}`;
  })
);

module.exports = function (content) {
  const { resource, cacheable } = this;
  const options = Object.assign({}, loaderUtils.getOptions(this));
  const {
    type = 'pre',
  } = options;
  if (cacheable) cacheable();

  if (type === 'post') {
    return unCommentImport(
      removeEmptyLine(
        content
      )
    );
  }

  return commentImport(
    compressFile(
      img2Base64(content, options, resource)
    )
  );
};
