# 自动化测试

---

## 参考

- [cucumber工具台](http://cuketest.com/zh-cn/cucumber/concepts#feature%E5%89%A7%E6%9C%AC)
- [cucumber语法](https://cucumber.io/docs/cucumber/cucumber-expressions/)

---

## 目录
<details>
<summary>展开更多</summary>

* [`cucumber`](#cucumber)
* [`cypress`](#cypress)
* [`常用工具`](#常用工具)
* [puppeteer](#puppeteer)

</details>

## cucumber

![cucumber语法中文映射](./cucumber语法中文映射.png)

---

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

### mozilla

```sh
RUN yum install -y firefox
```



### 中文字体

```sh
RUN yum -y install fontconfig
COPY ./你的字体.ttc /usr/share/fonts/
RUN fc-cache -vf
```

---

## 常用工具

### 屏幕录制
[https://segmentfault.com/a/1190000020266708](https://segmentfault.com/a/1190000020266708)

```js
navigator.mediaDevices.getDisplayMedia();
```

---



## puppeteer

### 安装依赖(ubantu)

```sh
RUN apt-get update && \
    apt-get install -y libgbm-dev && \
    apt-get install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y && \
    apt-get install -y fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf --no-install-recommends
```

