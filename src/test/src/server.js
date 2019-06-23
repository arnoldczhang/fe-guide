const http = require('http');
const fs = require('fs');

const run = () => {
  const port = 8999;
  const server = http.createServer((req, res) => {
    console.log('url ===>', req.url);
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
    });
    res.end(`${Math.random().toFixed(2)}`);
  });

  server.listen(port, () => {
    process.title = '测试进程 Node.js';
    console.log(`server started at ${port}`);
  });
};

run();

process.on('message', (msg) => {
  console.log('子进程收到消息', msg);
});

process.send({ hello: 'hello father'})

module.exports = run;
