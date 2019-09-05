# tree shake

## 参考
  - https://www.zhihu.com/question/41922432

## 原理
  - ast搜索
  - tree shake（DCE）：找到需要的代码，灌入最终的结果 - 消灭不可能执行的代码
  - 传统DCE：找到执行不到的代码，从 AST 里清除 - 消灭没有用到的代码

## 本质
  - ES6 modules - 静态分析
  - modules定义：
    1. 只能作为模块顶层的语句出现，不能出现在 function 里面或是 if 里面
    2. import 的模块名只能是字符串常量。
    3. 不管 import 的语句出现的位置在哪里，在模块初始化的时候所有的 import 都必须已经导入完成。换句话说，ES6 imports are hoisted。
    4. import binding 是 immutable 的，类似 const。比如说你不能 import { a } from './a' 然后给 a 赋值个其他什么东西。

## 问题
Q：直接 import 的文件无法移除？

比如：
```js
import menu from './menu';
```

A：menu文件里可能操控原型，所以无法直接移除
