let marked = require('./mark');
const fs = require('fs');
const fsevents = require('fsevents');
const watcher = fsevents(`${__dirname}/test.txt`);
const getTemplate = (tpl) => {
  return `
    <html>
      <head>
        <title>index</title>
      </head>
      <body>
        <div id="container">
        ${tpl}
        </div>
      </body>
    </html>
  `;
};

watcher.on('fsevent', function(path, flags, id) {
  ;
});

watcher.on('change', function(path, info) {
  const text = fs.readFileSync(`${__dirname}/test.txt`, 'utf8');
  marked = require('./mark');
  const result = marked(text);
  console.log(result);
  const template = getTemplate(result);
  fs.writeFile(`${__dirname}/test.html`, template, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.log('convert done');
  });
});
watcher.start();
