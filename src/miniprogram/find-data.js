/**
 * find all key used in template
 */
const {
  readdirSync: readDirS,
  readFileSync: readS,
  writeFile: write,
} = require('fs-extra');

let baseData = [];

const fileExprCach = {};
const rootPath = './src/pages/';
const savePath = './src/all.js';
const baseWxmlPath = './src/pages/base.wxml';

const exprRE = /{{([^{}]+)}}/g;
const spliterRE = /\s*(?:,|&&|\|\|)\s*/;
const ternaryRE = /(.+)\s*\?\s*(.+)\s*:\s*(.+)/;
const spreadRE = /\.\.\.([^.]+)/;
const keyOrLogicRE = /(?:^\s*\(?\s*!!?\s*\(?|[^:]+:\s*)(.+)/;
const compareRE = /\s*(?:>=?|<=?|={2,3}|!==?|\+)\s*/;
const stringRE = /\s*(?:'[^']*'?|"[^"]*"?)\s*/;
const baseAttrRE = /(?:\.length)$/;
const preOrSufRE = /(?:^\s*(\(\s*!?)?|\s*\)\s*$|\)?[\*+-]\d+\s*$|\s*\)*\s*$)/g;
const imgRE = /^\/\//;

const filterVariableWord = word => word.filter(
  w => w && w !== 'true' && w !== 'false' && w !== 'null'
    && !stringRE.test(w) && w !== '\'' && w !== '"'
    && w !== '[]'
    && Number.isNaN(+w)
    && !imgRE.test(w)
);

const commonSpliter = input => input.split(compareRE)
  .map(val => val.replace(keyOrLogicRE, '$1')
    .replace(preOrSufRE, '')
    .replace(baseAttrRE, '')
    .replace(keyOrLogicRE, '')
  ).filter(val => !stringRE.test(val));

const findFileData = (content) => {
  const output = [].concat(baseData);
  let result = exprRE.exec(content);
  while (result) {
    const phrase = result[1].split(spliterRE);
    const words = phrase.reduce((res, seg) => {
      if (seg) {
        const isTernary = ternaryRE.exec(seg);
        if (isTernary) {
          res.push(...isTernary.slice(1).reduce((terRes, ter) => {
            terRes.push(...commonSpliter(ter));
            return terRes;
          }, []));
        } else {
          const isSpread = spreadRE.exec(seg);
          if (isSpread) {
            res.push(isSpread[1]);
          } else {
            res.push(...commonSpliter(seg));
          }
        }
      }
      return res;
    }, []);
    output.push(...filterVariableWord(words));
    result = exprRE.exec(content);
  }
  return output;
};

const saveFile = () => {
  write(savePath, `
    module.exports = ${JSON.stringify(fileExprCach, null, 4)}
  `);
};

const analyseBaseFile = () => {
  const baseContent = readS(baseWxmlPath, 'utf-8');
  baseData = findFileData(baseContent);
};

const analysePageFiles = () => {
  const dirs = readDirS(rootPath);
  dirs.forEach((dir) => {
    // if (dir !== '') return;
    try {
      const fileContent = readS(`${rootPath}${dir}/${dir}.wxml`, 'utf-8');
      const data = findFileData(fileContent);
      fileExprCach[dir] = [...new Set(data)];
      console.log(`${dir}.wxml is done`);
    } catch (err) {
      // TODO
    }
  });
};

const exportDataToJson = () => {
  analyseBaseFile();
  analysePageFiles();
  saveFile();
};

exportDataToJson();
