# 函数式编程

## 参考
1. [functional-light js](https://github.com/getify/Functional-Light-JS/blob/master/manuscript/ch1.md/#chapter-1-why-functional-programming)

2. [mostly-adequate-guide](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)

## 思考
1. 声明式代码（根据函数声明，能大致了解入参内容及可能的处理）
2. 函数应该总是有输出

```js
// 入参声明
function foo( [x,y,...args] = [] ) {
    // ..
    return /*...*/;
}

// 返回值声明
var [ x, y ] = foo();
console.log( x + y );
```


