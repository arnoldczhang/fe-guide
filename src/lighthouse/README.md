# lighthouse

## 参考
[lighthouse指南](https://juejin.im/post/5dca05f45188250c643b7d76#heading-23)
[lighthouse-with-puppeteer](https://medium.com/@jovd/lighthouse-with-puppeteer-5dc4e3245eed)
[tesseract.js训练模型](https://github.com/naptha/tessdata)
[puppeteer疑难杂症](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch)

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

---

## puppeteer检查代码覆盖率
```js
const puppeteer = require('puppeteer');

async function checkCoverage(url) {
  const browser = await puppeteer.launch({ headless: false });
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