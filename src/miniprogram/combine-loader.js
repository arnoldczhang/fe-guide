/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const base64Img = require('base64-img');
const loaderUtils = require('loader-utils');
const {
  compressFile,
  removeComment,
  removeEmptyLine,
} = require('./utils');
module.exports = function (content) {
  const options = Object.assign({}, loaderUtils.getOptions(this));
  if (this.cacheable) this.cacheable();
  let result = content.replace(/(?:\.\/|)b64-{3}(.+)(-{3}|'|"\))/g, (match, $1, $2) => {
    const separate = $2 !== '---' ? $2 : '';
    const imagePath = $1.replace(/^(\.{1,2}\/)+/, '/').replace(/-{3}$/, '');
    const imageDirPath = imagePath.replace(/[^\/]+\.\w+$/, '');
    const absolutePath = path.join(__dirname, '../src', imagePath);
    let imageData;
    try {
      imageData = base64Img.base64Sync(absolutePath);
    } catch (err) {
      return `${separate}`;
    }
    return `${imageData}${separate}`;
  });
  result = compressFile(result);
  // console.log('\n');
  // console.log('\n');
  // console.log(result);
  // console.log(compressFile(result));
  // console.log(result);
  // fs.writeFile('aa.wxss', result, 'utf8');
  // return (compressFile(result, true, []));
  return result;
    // .replace(/\/\*[^\r\n\t\f]+\*\//g, '')
    // .replace(/[\r\n\t\f]+/g, '')
    // .replace(/\s{2,}/, ' ')
    ;
};
