const fs = require('fs-extra');
const path = require('path');

const ensureDir = (dir, callback, queue = []) => {
  try {
    if (dir) {
      const stat = fs.statSync(dir);
      if (!stat.isDirectory()) {
        return;
      }
    }
    while (queue.length) {
      let dir = queue.pop();
      dir = `${dir}/${dir}`;
      fs.mkdirsSync(dir);
    }
  } catch (err) {
    console.log('err', err, dir);
    ensureDir(dir.replace(/\/([^\/]+)\/?$/, (match, $1) => {
      queue.push($1);
      return '';
    }), callback, queue);
  }
  callback();
};

const searchFiles = (matchRe, src, result = {}, parent = '') => {
  const dirRe = /[^\.]/;
  fs.readdirSync(src).forEach((file) => {
    if (dirRe.test(file) || matchRe.test(file)) {
      const fullpath = path.join(src, file);
      if (fs.statSync(fullpath).isDirectory()) {
        searchFiles(matchRe, fullpath, result, `${parent}/${file}`);
      } else if (matchRe.test(fullpath)) {
        result[`${parent}/${file}`] = fullpath;
      }
    }
  });
  return result;
};

const removeComment = file => (
  file
    .replace(/(\/\*)((?!\1)[\s\S])*\*\//g, '')
    .replace(/(\/\*)((?!\*\/)[\s\S])*\*\//g, '')
    .replace(/(<!--)((?!\1)[\s\S])*-->/g, '')
    .replace(/(<!--)((?!-->)[\s\S])*-->/g, '')
    .replace(/(\s)\/\/.*/g, '$1')
);
const removeEmptyLine = file => (
  file
    .replace(/[\f\n\r\t\v]+/g, '')
    .replace(/ {1,}/, ' ')
);
const lambda = (...args) => {
  let file = args.pop();

  if (file instanceof Buffer) {
    file = file.toString();
  }

  if (typeof file === 'string') {
    while (args.length) {
      const func = args.pop();
      file = checkFuncAndRun(func, file);
    }
    return file;
  }
  return '';
};
const defaultSteps = [removeComment, removeEmptyLine];

const compressFile = (
  files,
  needCompress = true,
  steps = defaultSteps,
) => {
  if (needCompress) {
    files = Array.isArray(files) ? files : [files];
    const fileLength = files.length;
    if (!fileLength) return files;
    files = files.map(file => lambda.apply(null, steps.concat(file)));
    if (fileLength === 1) return files[0];
  }
  return files;
};

const checkFuncAndRun = (input, ...args) => {
  if (input instanceof Function) {
    return input(...args);
  }
};

module.exports = {
  lambda,
  ensureDir,
  searchFiles,
  compressFile,
  removeComment,
  removeEmptyLine,
  checkFuncAndRun,
};
