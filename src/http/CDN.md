# CDN-内容分发网络

## 参考
  - https://zhuanlan.zhihu.com/p/39028766

## 优势
  - 减轻源站（服务器）负载
  - 加速访问
  - 抗攻击

## 注意点
  - 缓存设置
    - nginx s-maxage（设置代理服务器的缓存时间）
  - 判断是否命中缓存
    - Hid -cach-Lookup
  -资源预热
    - 避免所有请求都打到原务器上
  - Vary
  - Range