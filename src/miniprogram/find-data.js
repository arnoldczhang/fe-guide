/**
 * find all key used in template
 */
const {
  readdirSync: readDirS,
  readFileSync: readS,
  writeFile: write,
} = require('fs-extra');

const fileExprCach = {};
const rootFilePath = './src/pages/';
const savePath = './all.json';

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
  const output = [];
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

const saveJson = () => {
  write(savePath, JSON.stringify(fileExprCach, null, 4));
};

const analysePageFiles = () => {
  const dirs = readDirS(rootFilePath);
  dirs.forEach((dir) => {
    // if (dir !== '') return;
    try {
      const fileContent = readS(`${rootFilePath}${dir}/${dir}.wxml`, 'utf-8');
      const data = findFileData(fileContent);
      fileExprCach[dir] = [...new Set(data)];
      console.log(`${dir}.wxml is done`);
    } catch (err) {
      // TODO
    }
  });
};

const exportDataToJson = () => {
  analysePageFiles();
  saveJson();
};

exportDataToJson();
