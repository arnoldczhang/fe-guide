/*
fsevents：监听文件内容变化
 */
const fsevents = require('fsevents');
const watcher = fsevents(__dirname);
watcher.on('fsevent', function(path, flags, id) {
  console.log(path, flags, id);
}); // RAW Event as emitted by OS-X
watcher.on('change', function(path, info) {
  console.log(info);
}); // Common Event for all changes
watcher.start(); // To start observation
console.log('...start watching');