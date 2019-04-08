const rpc = require('axon-rpc')
  , axon = require('axon')
  , rep = axon.socket('rep');
 
const server = new rpc.Server(rep);

server.expose({
  add: function(a, b, fn){
    fn(null, a + b);
  },
});

rep.bind(4000);

const net = require('net');

const server = net.createServer((c) => {
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  // c.write('hello\r\n');
  c.pipe(c);
});

server.add = function (a, b, fn) {
  fn(null, a + b);
};

server.listen(8124, () => {
  console.log('server bound');
});