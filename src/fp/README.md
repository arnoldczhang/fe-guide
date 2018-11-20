# 函数式编程

## 参考
1. [functional-light js](https://github.com/getify/Functional-Light-JS/blob/master/manuscript/ch1.md/#chapter-1-why-functional-programming)
2. [mostly-adequate-guide](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)

## 思考
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




