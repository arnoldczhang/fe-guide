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

- curry

```js
const curriedAjax = curry( ajax );

const personFetcher = curriedAjax( "http://some.api/person" );

const getCurrentUser = personFetcher( { user: CURRENT_USER_ID } );

getCurrentUser( function foundUser(user){ /* .. */ } );
```

- uncurry

```js
const curriedSum = curry( sum, 5 );
const uncurriedSum = uncurry( curriedSum );

curriedSum( 1 )( 2 )( 3 )( 4 )( 5 );        // 15

uncurriedSum( 1, 2, 3, 4, 5 );              // 15
uncurriedSum( 1, 2, 3 )( 4 )( 5 );          // 15
```


