const glob = require('glob');
const html = require('htmlparser2');
const {
  readFileSync,
} = require('fs');

const pageWxml = glob.sync('../waimai_wxapp/src/pages/*/*.wxml').filter(pathname => 
  /pages\/([^\/]+)\/\1\.wxml$/.test(pathname)
);

const html2ast = (rawHtml) => new Promise((resolve, reject) => {
  const parseHandler = new html.DefaultHandler((error, dom) => {
    if (error) {
      reject(error);
    } else {
      resolve(dom);
    }
  });
  const parser = new html.Parser(parseHandler);
  debugger;
  parser.parseComplete(rawHtml);
});

const fileContent = readFileSync(pageWxml[0], 'utf-8');
html2ast(fileContent).then((res) => {
  console.log(fileContent, res.length);
});