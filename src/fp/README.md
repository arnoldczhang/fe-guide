# 函数式编程

## 参考
1. [functional-light js](https://github.com/getify/Functional-Light-JS/blob/master/manuscript/ch1.md/#chapter-1-why-functional-programming)
2. [mostly-adequate-guide](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)
3. [30-seconds](https://github.com/30-seconds/30-seconds-of-code/blob/master/README.md)
4. [【译】JavaScript 中的函数式编程原理](https://segmentfault.com/a/1190000019052188?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com&share_user=1030000000178452#articleHeader4)
## 思考
- 业务开发，面向人；库开发，面向v8；
- 声明式代码（根据函数声明，能大致了解入参内容及可能的处理）
- 函数应该总是有输出

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
- 部分参数partial

```js
const getUser = partial(ajax, { url: 'https://xxx.xx.xx' });

const getCurrent(getUser, { id: CURRENT_USER_ID });
```

- 有序柯里curry

```js
const curriedAjax = curry( ajax );

const personFetcher = curriedAjax( "http://some.api/person" );

const getCurrentUser = personFetcher( { user: CURRENT_USER_ID } );

getCurrentUser( function foundUser(user){ /* .. */ } );
```

- 反柯里uncurry

```js
const curriedSum = curry( sum, 5 );
const uncurriedSum = uncurry( curriedSum );

curriedSum( 1 )( 2 )( 3 )( 4 )( 5 );        // 15

uncurriedSum( 1, 2, 3, 4, 5 );              // 15
uncurriedSum( 1, 2, 3 )( 4 )( 5 );          // 15
```

- 无序柯里curryProps

```js
const f1 = curryProps( foo, 3 );
const f2 = partialProps( foo, { y: 2 } );

f1( {y: 2} )( {x: 1} )( {z: 3} ); // x:1 y:2 z:3

f2( { z: 3, x: 1 } ); // x:1 y:2 z:3
```

- not/when
- compose/pipe
- 纯函数
- 不可变性
  - 对外部域变量的不可变
  - 对本域的变量的不可变（const、Object.freeze）
- 尾调用 TC
  - 指函数里的最后操作是一个函数调用
  - 尾递归 PTC
    - 若这个函数调用的是本身

- 函数反应式编程
当监听内容发生变化时，执行操作
```js
var a = new LazyArray();

var b = a.map(function double(v){
    return v * 2;
});

setInterval(function everySecond(){
    a.push(Math.random());
}, 1000);
```





