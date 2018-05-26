# http

## 参考
  - https://www.fastly.com/blog/headers-we-dont-want

## 无用头部
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
