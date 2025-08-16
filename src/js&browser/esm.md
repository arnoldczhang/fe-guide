# esm

[TOC]

## 参考

- [JavaScript模块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

## 解释
一般来讲分两种：.mjs和.cjs

**.cjs**：就是原来的 commonjs 方式（module.exports）

**.mjs**：ecmascript module system（export defalt），通过<script type="module" src="..."></script>加载

- Commonjs是拷贝输出，ES6模块化是引用输出
- Commonjs是运行时加载，ES6模块化是编译时输出接口
- Commonjs是单个值导出，ES6模块化可以多个值导出
- Commonjs是动态语法可写在函数体中，ES6模块化静态语法只能写在顶层
- Commonjs的this是当前模块化，ES6模块化的this是undefined


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



### import map

> 以 mapping 方式，预定义**esm引用名 <--> esm资源路径**，以便后续在 module 里的使用。

```html
<!-- 定义-->
<script type="importmap">
  {
    "imports": {
      "browser-fs-access": "https://unpkg.com/browser-fs-access@0.33.0/dist/index.modern.js"
    }
  }
</script>
<!-- 使用 -->
<script type="module">
  import { fileOpen } from 'browser-fs-access';
  fileOpen(/* 使用 */)
</script>
```

### import.meta

> 返回当前模块的一些信息（比如url等）

```html
<html>
<script type="module">
import './index.mjs?someURLInfo=5';
</script>
</html>
```

那么在index.mjs里

```js
console.log(import.meta.url); // file:///home/user/my-module.mjs?someURLInfo=5
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

