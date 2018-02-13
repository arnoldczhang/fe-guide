let marked = require('./mark');
const fs = require('fs');
const fsevents = require('fsevents');
const watcher = fsevents(`${__dirname}/`);

watcher.on('fsevent', function(path, flags, id) {
  ;
});

watcher.on('change', function(path, info) {
  const text = fs.readFileSync(`${__dirname}/test.txt`, 'utf8');
  marked = require('./mark');
  const result = marked(text);
  console.log(result);
});
watcher.start();
