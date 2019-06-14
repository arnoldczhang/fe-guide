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
    console.log(`server started at ${port}`);
  });
};

module.exports = run;
