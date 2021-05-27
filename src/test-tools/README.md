# 测试工具

---

## 参考

- [cucumber工具台](http://cuketest.com/zh-cn/cucumber/concepts#feature%E5%89%A7%E6%9C%AC)
- [cucumber语法](https://cucumber.io/docs/cucumber/cucumber-expressions/)

---

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

