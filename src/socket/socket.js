const http = require('http');
const engine = require('engine.io');
const server = engine.listen(8999, {}, () => {
  console.log('socket started');
});


// const server = http.createServer(function (req, res) {
//   res.writeHead(501);
//   res.end('Not Implemented');
// });

// console.log(server.listeners('request').slice(0));

 
server.on('connection', function(socket){
  socket.send('hi');
});
 
// // …
// server.on('handshake', function(req, socket, head){
//   console.log('11111');
//   // server.handleUpgrade(req, socket, head);
// });
// server.on('request', function(req, res){
//   console.log('ddd');
//   server.handleRequest(req, res);
// });




