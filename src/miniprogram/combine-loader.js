/* eslint-disable */
const path = require('path');
const base64Img = require('base64-img');
const loaderUtils = require('loader-utils');
const color = require('chalk');

const {
  compressFile,
  removeComment,
  removeEmptyLine,
  CONST,
} = require('./utils');

const {
  SRC,
  DEST,
} = CONST;

module.exports = function (content) {
  const { resource, cacheable } = this;
  const options = Object.assign({}, loaderUtils.getOptions(this));
  const {
    src = SRC,
    dest = DEST,
  } = options;
  if (cacheable) cacheable();
  let result = content.replace(/(?:\.\/|)b64-{3}(.+)(-{3}|'|"\))/g, (match, $1, $2) => {
    let imageData;
    const separate = $2 !== '---' ? $2 : '';
    const isRelativePath = /^\.{1,2}\//.test($1);
    const imagePath = $1.replace(/-{3}$/, '');
    const absolutePath = isRelativePath
      ? path.join(resource, '../', imagePath)
      : path.join(__dirname, `..${src}`, imagePath);
    try {
      imageData = base64Img.base64Sync(absolutePath.replace(src || '', dest || ''));
    } catch (err) {
      console.log(color.yellow(`${absolutePath} is not found or has exception`));
      return `${separate}`;
    }
    return `${imageData}${separate}`;
  });
  return compressFile(result);
};
