# sourcemap转换器

## 用法
```js
import transfer from './index';

// 输入
transfer(`
TypeError: Cannot read property 'xxxx' of null
at a.n (https://www.bidu.com/xx/pro/pppp/js/chunk-3498288a.96435196.js:1:174240)
`, {
  // 重试次数，默认0次
  // retryTimes?: boolean|number;
  // 过滤器，符合条件的 url 会跳过 sourcemap 转换，默认不做过滤
  // filter?: string|RegExp|Function;
  // 请求最大耗时，默认3000毫秒
  // maxTimeout?: number;
});

// 输出
// {
//   // 堆栈信息
//   stack?: string[] | string;
//   // 文件路径 -> 文件源码
//   urlMap?: ICO;
//   // 文件路径
//   urls?: string[];
// }
```