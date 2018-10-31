const http = require('http');
const url = require('url');
const crypto = require('crypto');

const constants = {
  BINARY_TYPES: ['nodebuffer', 'arraybuffer', 'fragments'],
  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
  kStatusCode: Symbol('status-code'),
  kWebSocket: Symbol('websocket'),
  EMPTY_BUFFER: Buffer.alloc(0),
  NOOP: () => {}
};

const WebsocketServer = new require('ws').Server;

const handleUpgrade = (request, socket, header, wsServer) => {
  wsServer.handleUpgrade(request, socket, header.copy(new Buffer(header.length)), (ws) => {
    wsServer.emit('connection', ws, request);
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
  // native websocket
  if (!socket.readable || !socket.writable) return socket.destroy();
  socket.on('error', socketOnError);
  const key = crypto.createHash('sha1')
    .update(req.headers['sec-websocket-key'] + constants.GUID, 'binary')
    .digest('base64');

  const headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${key}`
  ];

  let protocol = req.headers['sec-websocket-protocol'];

  if (protocol) {
    protocol = protocol.trim().split(/ *, */);
    headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
  }
  socket.emit('headers', headers, req);
  socket.write(headers.concat('\r\n').join('\r\n'));
  socket.removeListener('error', socketOnError);
  socket.on('connection', (ws) => {
    const str = 'hellloooooo world';
    const offset = 2;
    Buffer.allocUnsafe(str.length + offset);
    socket.write(Buffer.from('hellloooooo world'));
    socket.on('message', (message) => {
      // socket.write('aaaa');
      console.log('server: received: %s', message);
    });
  });

  socket.emit('connection', socket, req);
  // const pathname = url.parse(req.url).pathname;
  // console.log('pathname', pathname);

  // 原版websocket
  // handleUpgrade(req, socket, head, websocketServer);
});


function socketOnError () {
  this.destroy();
}

// const engine = require('engine.io');
// const server = engine.listen(8999, {}, () => {
//   console.log('socket started');
// });
// 
// 

// console.log(server.listeners('request').slice(0));

 
// server.on('connection', function(socket){
//   socket.send('hi');
// });
 
// // …
// server.on('handshake', function(req, socket, head){
//   console.log('11111');
//   // server.handleUpgrade(req, socket, head);
// });
// server.on('request', function(req, res){
//   console.log('ddd');
//   server.handleRequest(req, res);
// });








