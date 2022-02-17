# esm

## 参考

- [JavaScript模块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

## 例子

### 基础用法

```html
<!-- 主文件-->
<script type="module">
  import { default: setup } from '链接.mjs'；// js或mjs都可以
  setup(/* ... */);
</script>
```

```js
// 链接.mjs

export default function() {
  /* ... */
}
```

### 按需加载

```html
<!-- 主文件-->
<script type="module">
  import('链接.mjs').then(({ default: setup }) => {
  	setup(/* ... */);
  });
</script>
```





## 问题

### 是否支持嵌套引用？

> 支持

```js
// 链接.mjs
import '链接2.mjs';
import './链接3.js';

export default function() {
  /* ... */
}
```



### 是否支持本地文件？

> 支持

```html
<!-- 主文件-->
<script type="module">
  import { default: setup } from './src/链接.js'；// js或mjs都可以
  setup(/* ... */);
</script>
```



### export是否会等待文件请求

> 会

```js
// 链接.mjs
import '链接1.mjs'; // 请求链接1
import '链接2.mjs'; // 链接1结束，开始请求链接2
import '链接3.js'; // 链接2结束，开始请求链接3

// 所有链接请求完，export出来
export default function() {
  /* ... */
}
```



### export是否会等待promise

> 会

```js
// 链接.mjs
import '链接1.mjs'; // 请求链接1
import '链接2.mjs'; // 链接1结束，开始请求链接2
import '链接3.js'; // 链接2结束，开始请求链接3

// 等待promise的resolve
await new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 10000);
})

// 所有链接请求完&promise触发resolve，才会export出来
export default function() {
  /* ... */
}
```

