# puppeteer

## 参考
- [electron+puppeteer+Robotjs实践](https://mp.weixin.qq.com/s/mziw_VfwcO_qLglypbzy2A)
- [中文api](https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v3.0.1&show=api-class-puppeteer)

---

## 应用

### chrome录制插件
基于[puppeteer recorder](https://chrome.google.com/webstore/search/checkly?utm_source=chrome-ntp-icon)录制了页面的操作过程，一些微调后生成了测试案例，可以参考[项目](./test-case/README.md)

### 拦截请求
[参考](https://github.com/puppeteer/puppeteer/blob/v1.8.0/docs/api.md#requestrespondresponse)

```js
await page.setRequestInterception(true);
page.on('request', (req: any) => {
  const url: string = req.url();
  if (/example/.test(url)) {
    req.respond({
      status: 200,
      contentType: 'application/json;charset=UTF-8',
      body: JSON.stringify({
        content: {
          data: {
            resultCode: 100,
          },
          status: 0,
          success: true,
        },
        hasError: false,
      }),
    });
  } else {
    req.continue();
  }
  // interceptedRequest.abort();
});
```

### 操作iframe
```js
console.log('waiting for iframe with form to be ready.');
await page.waitForSelector('iframe');
console.log('iframe is ready. Loading iframe content');

const elementHandle = await page.$(
    'iframe[src="https://example.com"]',
);
const frame = await elementHandle.contentFrame();

console.log('filling form in iframe');
await frame.type('#Name', 'Bob', { delay: 100 });
```

