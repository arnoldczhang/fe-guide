const http = require('http');
const fs = require('fs');

const port = 3332;

http.createServer((req, res) => {
  const url = req.url;
  if(/test\.wasm/.test(url)) {
    res.end(fs.readFileSync('./src/webassembly/test.wasm'));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync('./src/webassembly/index.html'));
  }
}).listen(port, () => {
  console.log(`start at ${port}`);
});

