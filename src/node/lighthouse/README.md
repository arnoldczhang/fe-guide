# lighthouse

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


