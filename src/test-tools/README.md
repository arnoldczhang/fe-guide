# 测试工具

## webdriver

---

## cypress
- [官网](https://docs.cypress.io/guides/overview/why-cypress.html#Debugging-tests)
- [从Three.js测试源码探索前端可视化项目的E2E测试方案](https://mp.weixin.qq.com/s/nNzMgc7U8M1cO-h6r0oHSA)
- [cypress-assertion](https://docs.cypress.io/guides/references/assertions#BDD-Assertions)
- [cypress-interception](https://docs.cypress.io/api/commands/intercept#Intercepting-a-response)

### 容器内安装
```sh
# 如果提示，类似需要配置 HTTP_PROXY 这样的错误
export http_proxy="一个代理地址" && ./node_modules/.bin/cypress install
```

### 依赖
```sh
# https://docs.cypress.io/guides/continuous-integration/introduction#Dependencies

RUN yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib

```

### chrome

```sh
RUN yum install -y google-chrome-stable
```

### 中文字体

```sh
RUN yum -y install fontconfig
COPY ./你的字体.ttc /usr/share/fonts/
RUN fc-cache -vf
```





---

