# node镜像



## 总结

### 组成

linux版本 + 工具包合集 + nodejs运行时



### 版本

alpine、slim



### 自有镜像能干什么

- 设置公司自己的npm代理源
- 设置npm包的第三方依赖环境变量，比如node-sass、puppeteer等
- 安装pnpm
- 解决CI场景因为buildkit缓存问题导致的install 失败或者build失败
- bff启动之前的前置检查等



## 参考

[搭建自有node镜像](https://mp.weixin.qq.com/s?__biz=MzIyNDU2NTc5Mw==&mid=2247510470&idx=1&sn=74830f3b03b2c8611040171483c7b236&scene=21#wechat_redirect)