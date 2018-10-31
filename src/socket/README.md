# websocket升级指南

## server搭建

### 步骤
1. 创建node-server和websocket-server
2. 监听node-server的upgrade事件（请求头会携带【Upgrade:websocket】）
3. 触发upgrade事件后，执行websocket-server的upgrade事件
4. 触发websocket-server的connection

### 实现
```js
const http = require('http');
const url = require('url');
const WebsocketServer = new require('ws').Server;

const handleUpgrade = (request, socket, header, server) => {
  server.handleUpgrade(request, socket, header.copy(new Buffer(header.length)), (ws) => {
    server.emit('connection', ws, request);
  });
};

// 创建websocket
const websocketServer = new WebsocketServer({
  noServer: true,
  clientTracking: false,
});

websocketServer.on('connection', (ws) => {
  console.log('server: receive connection.');
  ws.on('message', (message) => {
    console.log('server: received: %s', message);
  });
  ws.send('hello world');
});

// 创建普通httpserver
const server = http.createServer((req, res) => {
  res.writeHead(501);
  res.end('Not Implemented');
});

server.listen(8999, () => {
  console.log('server started');
});

server.on('request', (req, res) => {
  // ...
});

server.on('upgrade', (req, socket, head) => {
  const pathname = url.parse(req.url).pathname;
  console.log('pathname', pathname);
  handleUpgrade(req, socket, head, websocketServer);
});
```