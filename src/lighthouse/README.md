# lighthouse

## 参考
[lighthouse-with-puppeteer](https://medium.com/@jovd/lighthouse-with-puppeteer-5dc4e3245eed)
[tesseract.js训练模型](https://github.com/naptha/tessdata)

## 图像识别
[深度学习-tesseract.js](https://www.npmjs.com/package/tesseract.js)
[tesseract示例1](https://hanks.pub/2017/03/26/node-image-recognition/)
[tesseract示例2](https://blog.csdn.net/qq_35077107/article/details/105341115)
[验证码去干扰](https://www.jianshu.com/p/2048b8826d03)
[图像处理](https://www.npmjs.com/package/gm)

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

## 单次验证
[otplib](https://www.npmjs.com/package/otplib)

