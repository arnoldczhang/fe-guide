const sourceMap = require('source-map');
const fs = require('fs');
const path = require('path');
async function readFile (filePath) {
  const data = await new Promise(function (resolve, reject) {
    fs.readFile(filePath, {encoding:'utf-8'}, function(error, data) {
      if (error) {
        console.log(error)
        return reject(error);
      }
      resolve(data);
    });
  });
  return data;
};

async function searchSource(filePath, line, column) {
  const rawSourceMap = await readFile(filePath);
  const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap);
  const res = consumer.originalPositionFor({
    'line' : line,
    'column' : column
   });
   consumer.destroy();
  return res
}

searchSource(path.join(__dirname, './compiled.js.map'), 14, 28086);



