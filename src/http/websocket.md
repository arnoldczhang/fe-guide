# websocket

## 参考
- [websocket指北](https://mp.weixin.qq.com/s?__biz=MzA5NzkwNDk3MQ==&mid=2650590427&idx=1&sn=9deefe2e4bbcfb4dab3aab6aa986d457&chksm=8891dcffbfe655e9e1eae205c556276fd9da7f22c98f0b4f539d5cafd81619d00e01cd8d2857&scene=38#wechat_redirect)
- ![websocket](websocket.png)

## 应知

### 请求头
```
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

#### 必含字段
- 请求方式必须为GET，协议必须大于1.1
- `HOST`，其格式为hostname[:port]
- `Upgrade`，其值必须包含 websocket 关键字
- `Connection`，其值为必须包含 Upgrade
- `Sec-WebSocket-Key`，握手协议的密钥，其值为随机生成的16字节的值用 BASE64 编码后的字符串
- `Origin`（若客户端为浏览器，则必须有），其值为请求发起方的 hostname (因为中间可能经过代理才到达服务器，服务器可以根据该字段选择是否和客户端建立连接)
- `Sec-WebSocket-Version`，其值必须为 13

#### 可选字段
- `Sec-WebSocket-Protocol`，用于区分相同url下，对应的不同协议；其值为由逗号分隔的子协议的名字，按优先度排序，每个名字必须唯一
- `Sec-WebSocket-Extension`，表示协议级别的扩展
- 除以上要求外，可有其它任意符合HTTP的协议头，例如cookies之类的都可以

### 返回头
```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat
Sec-WebSocket-Origin: null
Sec-WebSocket-Location: ws://example.com/
```

- `Sec-WebSocket-Accept`，服务端确认&加密过的`Sec-WebSocket-Key`
- `Sec-WebSocket-Location`，通信的 websocket 网址
- `Sec-WebSocket-Protocol`，最终使用的协议

## 过程
1. 客户端发一个 HTTP GET 请求，请求服务端将连接升级到 websocket
2. 如果服务端支持 WebSocket，那就构造一个 HTTP 响应（状态码必须为101）返回，
若不支持，则返回其他合理状态码的响应，以说明理由
3. 服务端就可以发送 websocket 消息帧了

## 终止
- 连接任一端想关闭websocket，就发一个close frame（opcode为0x8的就是close frame）给对端
- 对端收到该frame，若之前没有发过close frame，则必须回复一个close frame
- 发送或回复close frame后该端就不能再发任何frame，但可以接收数据
- close frame之后无法保证数据完整性





