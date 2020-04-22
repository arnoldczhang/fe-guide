# lighthouse封装

## 字段
- settings
- passes
- audits
- categories
- groups

## 用法
```js
import Lighthouse from './index';

const lighthouse = new Lighthouse(url, opt, config);
const report = await lighthouse.run();

console.log(report.getJson()); // lighthouse-json结果
console.log(report.getHtml()); // lighthouse-html结果
```

## 其他

**lighthouse支持定义额外头部**

[参考](https://github.com/GoogleChrome/lighthouse/blob/master/docs/authenticated-pages.md)

命令形式
```cmd
lighthouse http://www.example.com --view --extra-headers="{\"Authorization\":\"...\"}"
```

js形式
```js
const result = await lighthouse('http://www.example.com', {
  extraHeaders: {
    Authorization: '...',
  },
});
```

