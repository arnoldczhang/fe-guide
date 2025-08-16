const fs = require('fs');

/**
 * genHash
 */
const genHash = (
  suffix = '',
) => `${Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)}${suffix || ''}`;

/**
 * clearDir
 * @param {*} dir
 * @param {*} clear 
 */
const clearDir = (dir, clear = false) => {
  if (fs.existsSync(dir)) {
    files = fs.readdirSync(dir);
    files.forEach((file) => {
      const curDir = dir + "/" + file;
      if (fs.statSync(curDir).isDirectory()) {
        clearDir(curDir, clear);
      } else {
        fs.unlinkSync(curDir);
      }
    });

    if (clear) {
      fs.rmdirSync(dir);
    }
  }
};

/**
 * getLastLength
 * @param {*} input 
 */
const getLastLength = (input) => (input[input.length - 1] || '').length;

/**
 * read
 * @param {*} fileName 
 */
const read = fileName => fs.readFileSync(fileName, 'utf-8');

/**
 * write
 * @param {*} fileName 
 * @param {*} content 
 */
const write = (
  fileName,
  content = '',
) => fs.writeFileSync(fileName, content, 'utf-8');

exports.genHash = genHash;

exports.clearDir = clearDir;

exports.getLastLength = getLastLength;

exports.read = read;

exports.write = write;
