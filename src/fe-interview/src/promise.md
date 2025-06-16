# Promise
> 解决异步问题的状态机
>
> [「2021」高频前端面试题汇总之代码输出结果篇在前端面试中，常考的代码输出问题主要涉及到以下知识点：异步编程、事件循环、 - 掘金](https://juejin.cn/post/6959043611161952269)

## 知识点

### resove和reject

- resolve和reject可以无限调用
- 只会触发一次回调，即then和catch二选一

### then入参

- 只接受**函数**
- 非函数，则透传上一个promise

### 循环嵌套

- promise return自己会报错

```js
const promise = Promise.resolve().then(() => {
  return promise;
})
promise.catch(console.err) // Uncaught (in promise)
```

### finally

- finally是特殊的then

- 不接受入参，默认返回上一次promise结果

```js
Promise.resolve('1')
  .then(res => {
    console.log(res)
  })
  .finally(() => {
    console.log('finally')
  })
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')
      return '我是finally2返回的值'
  })
  .then(res => {
    console.log('finally2后面的then函数', res)
  })
```

答案
```
/*
1
finally2
finally
finally2后面的then函数 2
*/
```

### Promise.all、Promise.race
- 只要出现reject，只进catch不进then
- catch的入参是**第一个**reject的结果