# lighthouse

## 参考
- [lighthouse指南](https://juejin.im/post/5dca05f45188250c643b7d76#heading-23)
- [lighthouse-with-puppeteer](https://medium.com/@jovd/lighthouse-with-puppeteer-5dc4e3245eed)
- [tesseract.js训练模型](https://github.com/naptha/tessdata)
- [puppeteer疑难杂症](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch)

## 图像识别

### 参考
- [深度学习-tesseract.js](https://www.npmjs.com/package/tesseract.js)
- [tesseract示例1](https://hanks.pub/2017/03/26/node-image-recognition/)
- [tesseract示例2](https://blog.csdn.net/qq_35077107/article/details/105341115)
- [验证码去干扰](https://www.jianshu.com/p/2048b8826d03)
- [图像处理](https://www.npmjs.com/package/gm)
- [Opencv：验证码图像处理](https://blog.csdn.net/weixin_43582101/article/details/90609399)

### 示例
```js
const Tesseract = require('tesseract.js');
Tesseract
  .recognize(filePath, {
      lang: 'eng', // 语言选英文
      tessedit_char_blacklist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
          //因为是数字验证码，排除字母
  })
  .then((result) => {
      callback(result.text);
  });
```

具体实现可[参考](./tesseract.js)

---

## 单次验证
[otplib](https://www.npmjs.com/package/otplib)

---

## lighthouse封装
[参考](../node/lighthouse/README.md)
[自定义lighthouse统计指标](https://github.com/GoogleChrome/lighthouse/blob/master/docs/recipes/lighthouse-plugin-example/readme.md)

### 配置说明

**throttlingMethod**

[参考](https://stackoverflow.com/questions/49899765/how-to-disable-throttling-in-lighthouse-programmaticaly/55850374#55850374)
> 节流方式，有 provided、devtools、simulate，provided表示不节流

```js
{
  "settings": {
    throttlingMethod: 'provided', // 直接使用当前网络环境测试
    throttling: {
      throughputKbps: 8000,
      downloadThroughputKbps: 8000,
      uploadThroughputKbps: 2000,
    },
  },
}
```

含义看代码
```js
// node_modules/lighthouse/lighthouse-core/computed/load-simulator.js

switch (throttlingMethod) {
  case 'provided':
    options.rtt = networkAnalysis.rtt;
    options.throughput = networkAnalysis.throughput;
    options.cpuSlowdownMultiplier = 1;
    options.layoutTaskMultiplier = 1;
    break;
  case 'devtools':
    if (throttling) {
      options.rtt =
        throttling.requestLatencyMs / constants.throttling.DEVTOOLS_RTT_ADJUSTMENT_FACTOR;
      options.throughput =
        throttling.downloadThroughputKbps * 1024 /
        constants.throttling.DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR;
    }

    options.cpuSlowdownMultiplier = 1;
    options.layoutTaskMultiplier = 1;
    break;
  case 'simulate':
    if (throttling) {
      options.rtt = throttling.rttMs;
      options.throughput = throttling.throughputKbps * 1024;
      options.cpuSlowdownMultiplier = throttling.cpuSlowdownMultiplier;
    }
    break;
  default:
    // intentionally fallback to simulator defaults
    break;
}
```

---

## puppeteer
[踩坑指南](https://juejin.im/post/5b99c9ece51d450e51625630)

不装chromium指令

```
env PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm i puppeteer -D
```

```js
// 检查代码覆盖率
const puppeteer = require('puppeteer');

async function checkCoverage(url) {
  const pathToExtension = '/usr/bin/google-chrome-stable';
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--headless',
      '--disable-gpu',
      '--show-paint-rects',
    ],
    // 服务器上不装 chromium，或装失败的话，需要用 executablePath 手动指定机器上的 google-chrome-stable（一般是上面这个地址），其他情况不用
    executablePath: pathToExtension,
  });
  const page = await browser.newPage();
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage(),
  ]);
  await page.goto(url);
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  await page.close();
  await browser.close();
  console.log(jsCoverage, cssCoverage);
}
```
