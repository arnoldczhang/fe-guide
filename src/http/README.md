# network

## 参考
- https://www.fastly.com/blog/headers-we-dont-want
- https://www.nihaoshijie.com.cn/index.php/archives/630/
- [前端必须明白的 http 知识点](https://mp.weixin.qq.com/s/4tluvji9YVtxloqmssY-Nw)
- [把网站升级到QUIC](https://www.yinchengli.com/2018/06/10/quic/)
- [https连接的前几毫秒发生了什么](https://fed.renren.com/2017/02/03/https/)
- [流量劫持](https://zhuanlan.zhihu.com/p/40682772)

## 目录
<details>
<summary>展开更多</summary>

* [`request header`](#request header)
* [`http1.0`](#http1.0)
* [`http1.1`](#http1.1)
* [`spdy`](#spdy)
* [`http 2.0`](#http 2.0)
* [`quic`](#quic)
* [`https`](#https)

</details>

## request header

### 请求无用头部（新版）
- server
- expires
- x-powered-by
- pragma
  - 可用Cache-Control: no-store, private替代
- x-frame-options
  - 防范[clickjacking](https://en.wikipedia.org/wiki/Clickjacking)（UI虚假内容点击，比如下载按钮搞成图片）
  - 可用Content-Security-Policy: frame-ancestors 'self'代替
- x-cache
- via
- p3p
- x-aspnet-version
- x-ua-compatible

### 未来头部新字段
- "Device-Memory" ":" #memory-value
  - 浏览器可以返回设备内存大小给服务端，Chrome 63+ 和 Opera50+支持

## http1.0
  - 带宽限制
  - 延迟
    - 浏览器阻塞（并行请求）
    - DNS查询（域名发散）
    - tcp
  - 状态码
    - 301: 永久重定向
    - 302: 临时重定向
      * 只有当服务器发出 Cache-Control 或 Expires（废弃） 头字段进行指示，
        此响应才能被缓存，否则不能被缓存
      * 临时URI应该由响应头部中的 Location 字段给出
      * 在除 GET 或 HEAD 两种请求方法之外的请求时，接收到302状态码，
        客户端不得自动重定向请求，除非用户可以确认
  - 缓存处理
    - If-Modified-Since：再次请求服务器时，通过此字段通知服务器上次请求时，服务器返回的资源最后修改时间
    - 缓存头部优先级：Pragma > Cache-Control > Expires（废弃） > ETag > Last-Modified

## http1.1
  - 缓存处理扩展
    - Entity tag，If-Unmodified-Since, If-Match, If-None-Match
    - Cach-Control
      - private：客户端可以缓存
      - public：客户端和代理服务器都可缓存
      - max-age=xxx：缓存的内容将在 xxx 秒后失效
      - no-cache：需要使用对比缓存来验证缓存数据
      - no-store：所有内容都不会缓存，强制缓存，对比缓存都不会触发
  - 带宽优化
    - range，请求资源一部分（206），支持断点续传
  - 错误通知
    - 新增状态码
      - 303：明确表示客户端应当采用get方法获取资源
      - 307：不会把POST转为GET
  - host处理
    - 一台服务器，多个server，同一个ip
  - 长连接
    - 一次tcp传多个http请求（keep-alive）

### 缓存字段
  - ![缓存字段](缓存字段.jpg)

## spdy
- 多路复用
- 请求优先级（可设置）
- 首部压缩
- 服务端推送

## http 2.0
- 多路复用：同一个tcp连接上并行请求，双向交换消息
- ![多路复用](多路复用.png)
- 二进制分帧：将首部信息和请求体，采用二进制编码封装进HEADER和BODY frame
- ![二进制分帧](二进制分帧.png)
- 首部压缩
- 服务端推送

### spdy与http 2.0区别
- HTTP2.0 支持明文 HTTP 传输，而 SPDY 强制使用 HTTPS
- HTTP2.0 消息头的压缩算法采用 HPACK，而非 SPDY 采用的 DEFLATE

## quic
- 基于UDP
- 通过减少往返次数，以缩短连接建立时间
- 使用一种新的ACK确认机制（包含了NACK），达到更好的拥塞控制
- 多路复用，并解决HTTP/2队头阻塞问题，即一个流的TCP包丢失导致所有流都暂停组装。在QUIC里面，一个流的包丢失只会影响当前流，不会影响其它流。
- 使用FEC（前向纠错）恢复丢失的包，以减少超时重传
- 使用一个随机数标志一个连接，取代传统IP + 端口号的方式，使得切换网络环境如从4G到wifi仍然能使用之前的连接。
- ![quic](6.png)

### 对比http/https/quic
- ![tls](p10.png)

## https
  - http + tls
  - ![加密](24.png)
    - 服务器选中的密钥交换加密方式为RSA
    - 数据传输加密方式为AES
    - 检验数据是否合法的算法为SHA256
  - ![https](10.png)
  - ![https-2](https-2.jpg)
  - 公钥加密，私钥解密
  - 过程 -> 3RTT
    - ![https](201208201734403507.png)

### HTTP、HTTPS、TCP、SSL/TLS
- HTTP基于TCP
- SSL/TLS基于TCP
- HTTPS基于SSL/TLS

### ssl和tls
- tls由ssl演变而来，目前ssl已极不安全
- 推荐tls1.2
- ![ssl-tls](ssl-tls.jpg)


