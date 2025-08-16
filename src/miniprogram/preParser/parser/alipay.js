const path = require('path');
const fs = require('fs');
const util = require('util');
const webpack = util.promisify(require('webpack'));
const generate = require('@babel/generator').default;
const { parse, traverse } = require('@babel/core');
const {
  clearDir,
  genHash,
  getLastLength,
  read,
  write,
} = require('../utils');
const {
  webpackCommentRE,
  myRE,
} = require('../reg');
const {
  DEFAULT_TEMP_PATH,
  MAIN_FILE_PATH,
  DEFAULT_WEBPACK_OUT_PATH,
  babelConfig,
} = require('../const');

/**
 * splitCode
 * @param {*} input 
 * @param {*} tempPath 
 */
function splitCode(
  input = '',
  tempPath = DEFAULT_TEMP_PATH,
) {
  clearDir(tempPath, true);
  fs.mkdirSync(tempPath);
  const result = [];

  let execResult = webpackCommentRE.exec(input);
  let lastIndex;

  while(execResult) {
    const [prefix] = execResult;
    const { index } = execResult;
  
    if (lastIndex) {
      const fileContent = input.substring(lastIndex + getLastLength(result), index);
      const fileName = genHash('.js');
      const filePath = path.join(tempPath, `./${fileName}`);
      // write dependency to single file
      write(filePath, `module.exports = ${fileContent.replace(/,\s*$/, ';')}`);
      result.push(`require('${filePath}'),`);
    } else if (index) {
      result.push(input.substring(0, index));
    }
  
    lastIndex = index;
    result.push(prefix);
    execResult = webpackCommentRE.exec(input);
  }

  result.push(input.substring(lastIndex + getLastLength(result)));
  write(path.join(tempPath, MAIN_FILE_PATH), result.join(''));
};

/**
 * babelTrans
 * @param {*} input 
 */
function babelTrans(input) {
  const ast = parse(input, babelConfig);
  traverse(ast, {
    MemberExpression(p) {
      const object = p.get('object');
      if (object && object.node && object.node.name) {
        const { name } = object.node;
        if (myRE.test(name)) {
          object.node.name = `$$myProxy(${name})`;
        }
      }
    },
  });
  const { code } = generate(ast);
  return code;
};

/**
 * replaceCode
 * @param {*} tempPath 
 */
function replaceCode(
  tempPath = DEFAULT_TEMP_PATH,
) {
  if (fs.existsSync(tempPath)) {
    // trans dependency code
    files = fs.readdirSync(tempPath);
    files.forEach((fileName) => {
      const filePath = `${tempPath}/${fileName}`;
      const code = read(filePath);
      write(filePath, babelTrans(code));
    });

    // trans mainFile code
    const mainFilePath = path.join(tempPath, MAIN_FILE_PATH);
    const proxyCode = read(path.join(__dirname, '../utils/proxy.js'));
    const mainContent = read(mainFilePath);
    write(mainFilePath, `
      ${proxyCode}
      ${babelTrans(mainContent)}
    `);
  }
};

/**
 * combineAndExportCode
 * @param {*} outputPath 
 * @param {*} option 
 */
async function combineAndExportCode(
  outputPath,
  option = {},
) {
  const {
    webpackOutPath = DEFAULT_WEBPACK_OUT_PATH,
    tempPath = DEFAULT_TEMP_PATH,
  } = option;

  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);
  }

  const mainFilePath = path.join(tempPath, MAIN_FILE_PATH);
  await webpack({
    mode: process.env.NODE_ENV || 'development',
    entry: mainFilePath,
    output: {
      path: webpackOutPath,
      filename: MAIN_FILE_PATH,
      globalObject: 'window',
    },
  });

  if (outputPath) {
    const mainFileDistPath = path.join(webpackOutPath, MAIN_FILE_PATH);
    write(outputPath, read(mainFileDistPath));
  }

  clearDir(tempPath, true);
  clearDir(webpackOutPath, true);
};

/**
 * run
 * @param {*} param0 
 */
function run({
  code,
  tempPath = DEFAULT_TEMP_PATH,
  webpackOutPath = DEFAULT_WEBPACK_OUT_PATH,
  outputPath,
}) {
  if (fs.existsSync(tempPath)
    && !fs.statSync(tempPath).isDirectory()
  ) {
    throw new Error('临时路径必须存在且为目录');
  }
  splitCode(code, tempPath);
  replaceCode(tempPath);
  combineAndExportCode(outputPath, { webpackOutPath, tempPath });
};

module.exports = run;