# 小程序websocket

## 参考
  - https://github.com/10cella/weapp.socket.io

## 流程

### server
```js
const WebSocketServer = require('ws').Server;

const io = new WebSocketServer({ port: 8080 });

io.on('connection', (socket) => {
  socket.on('message', (obj) => {
    console.log(obj);
    obj = JSON.parse(obj);
    switch (obj.type) {
      case 'fuck?':
      default:
        io.clients.forEach((client) => {
          if (client.readyState == 1) {
            obj.type = 'result';
            client.send(JSON.stringify(obj));
          }
        });
        break;
    };
  });
});
```

### client
```js
const io = require('./weapp-socket');
page({
  onLoad() {
    this.socket = new io(`ws://localhost:8080`, {});
    this.socket.on('res', d => {
      console.log('received news: ', d);
    });
    this.socket.emit('news', { title: 'this is a news' });
    this.socket.send({type: 'fuck?', data: { title: 'this is a news' }});
  },
});
```

