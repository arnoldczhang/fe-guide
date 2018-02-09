const marked = require('marked');
const fs = require('fs');
const fsevents = require('fsevents');
const watcher = fsevents(`${__dirname}/mark.txt`);

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
  const text = fs.readFileSync('./src/markdown/mark.txt', 'utf8');
  const result = marked(text);
  console.log(text.split(/\n/));
  const template = getTemplate(result);
  fs.writeFile(`${__dirname}/index.html`, template, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.log('convert done');
  });
});
watcher.start();




// '--- \n 项目  |   价格  |  数量|\n - | -----|---:|----:|\naa|aa|aa\n'
