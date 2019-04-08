// const rpc = require('axon-rpc')
//   , axon = require('axon')
//   , req = axon.socket('req');
// const req2 = axon.socket('req')
 
// var client = new rpc.Client(req);
// req.connect(4000);

// var client2 = new rpc.Client(req2);
// req2.connect(4001);

// client.methods(function(err, methods){
//   console.log(methods);
// });

// client2.methods(function(err, methods){
//   console.log(methods);
// });

// client.call('add', 1, 2, function(err, n){
//   console.log(n);
//   // => 3
// })


const net = require('net');

const clientSocket = new net.Socket();

clientSocket.connect({port: 8124}, () => {
  console.log('client connected');
  clientSocket.write('world!\r\n');
});

clientSocket.on('data', (data) => {
  console.log(data.toString());
  clientSocket.end();
})


// const client = net.createConnection({ port: 8124 }, () => {
//   //'connect' listener
//   console.log('connected to server!');
//   client.write('world!\r\n');
// });

// client.on('data', (data) => {
//   console.log(data.toString());
//   client.end();
// });
