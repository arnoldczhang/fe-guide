# pm2

## 相关概念

### rpc
- 远程过程调用
- 过程
  - 客户端与A服务器建立TCP连接
  - A服务器调用B服务器的方法，需要将内存中的参数值，序列化成二进制的形式
  - 通过寻址和传输将序列化的二进制发送给B服务器
  - B服务器反序列化参数，恢复为内存中的表达方式，调用本地方法后，将结果序列化后，返回给A服务器
  - A服务器反序列化，恢复为内存中的表达方式，交给A服务器上的应用
- 相关库
  - axon-rpc
  - axon

### rpc-server
```js
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
```

### rpc-client
```js
const rpc = require('axon-rpc')
  , axon = require('axon')
  , req = axon.socket('req');
const req2 = axon.socket('req');
 
var client = new rpc.Client(req);
req.connect(4000);

client.methods(function(err, methods){
  console.log(methods);
});

client.call('add', 1, 2, function(err, n){
  console.log(n);
  // => 3
});
```

### net VS http => createServer
- http.createServer基于net做封装
- [两者对比](http://zhenhua-lee.github.io/node/socket.html/)

### net
- net.createConnection
  ```js
  const client = net.createConnection({ port: 8124 }, () => {
    //'connect' listener
    console.log('connected to server!');
    client.write('world!\r\n');
  });

  client.on('data', (data) => {
    console.log(data.toString());
    client.end();
  });
  ```
- net.Socket
  ```js
  const net = require('net');

  const clientSocket = new net.Socket();

  clientSocket.connect({port: 8124}, () => {
    console.log('client connected');
    clientSocket.write('world!\r\n');
  });

  clientSocket.on('data', (data) => {
    console.log(data.toString());
    clientSocket.end();
  });
  ```
- net-server
  ```js
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
  ```

### pm2初始化过程
```js
// 
this.client = new Client({
  // ...
});

//
KMDaemon.ping(this._conf, () => {
  // ...
});
```




