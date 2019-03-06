const remark = require("remark");
const path = require("path");
const {
  readFileSync,
  writeFile,
} = require('fs-extra');
const getPath = filePath => path.join(__dirname, filePath);

const ast = remark().parse(readFileSync(getPath('./test.md'), 'utf8'));

console.log(ast);
