# 测试工具

## webdriver

---

## cypress
[官网](https://docs.cypress.io/guides/overview/why-cypress.html#Debugging-tests)
[从Three.js测试源码探索前端可视化项目的E2E测试方案](https://mp.weixin.qq.com/s/nNzMgc7U8M1cO-h6r0oHSA)

### 容器内安装
```sh
# 如果提示，类似需要配置 HTTP_PROXY 这样的错误
export http_proxy="一个代理地址" && ./node_modules/.bin/cypress install
```

### 依赖
```sh
# https://docs.cypress.io/guides/continuous-integration/introduction#Dependencies

yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib

```

---
