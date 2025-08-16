# llhttp

## DSL
[llparse](https://github.com/nodejs/llparse)

> llparse 不仅仅可用于解析 http 请求报文，还能做通用解析

```js
import { LLParse } from 'llparse';
// import { writeFileSync } from 'fs';

const p = new LLParse('myfsm');

// 创建状态节点 start
const start = p.node('start');

// 创建调用节点 onMatch
const onMatch = p.invoke(
  p.code.match('onMatch'),
  {
    0: start
  },
  p.error(1, 'onMatch error')
);

// start 状态匹配到 hello 之后，进入 onMatch节点
// 否则输出 expect "hello"
start.match('hello', onMatch).otherwise(p.error(1, 'expect "hello"'));

// 编译状态机
// 状态机从 start 开始
const artifacts = p.build(start);

console.log(artifacts.js);
console.log('================');
console.log(artifacts.c);
```

