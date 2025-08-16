# EventSource



[TOC]


## chatgpt实现

### 服务端

```js
const http = require('http');

http.createServer((req, res) => {

  if (req.url === '/article') {
    res.writeHead(200, {
      // 开启 Server-sent events
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      // 保持连接
      'Connection': 'keep-alive',
      // 允许跨域
      'Access-Control-Allow-Origin': '*'
    });
    let index = 0;
    const song = [/* 很长的一个数组 */];

    // 模拟每隔0.5s向前端推送一次
    setInterval(() => {
      const s = song[index];

      if (s) {
        res.write(`data: ${song[index]}\n\n`);
      } else {
        res.write('0');
      }
      index++;
    }, 500);
  }
}).listen(3000);
```



### 客户端

```js
// 建立连接
const source = new EventSource('http://localhost:3000/article');
let str = '';
// 接收信息
source.onmessage = function (e) {
  if (e.data === 'end') {
    // 判断end，关闭连接
    source.close()
  }

  str += e.data
  // 实时输出字符串
  console.log(str)
};
```



## 和websocket区别

1. WebSocket基于TCP协议，EventSource基于http协议
2. EventSource是单向通信，而websocket是双向通信
3. EventSource只能发送文本，而websocket支持发送二进制数据
4. 在实现上EventSource比websocket更简单
5. EventSource有自动重连接（不借助第三方）以及发送随机事件的能力
6. websocket的资源占用过大EventSource更轻量
7. websocket可以跨域，EventSource基于http跨域需要服务端设置请求头