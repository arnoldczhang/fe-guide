#参考
  - https://www.jianshu.com/p/0983e69d58ec
  - https://zhuanlan.zhihu.com/p/30744300
  - https://juejin.im/entry/59082301a22b9d0065f1a186
  - 深入浏览器事件循环：https://zhuanlan.zhihu.com/p/45111890
  - Tasks, microtasks：https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
  - ![运行机制](2954145-5bb92d1fbdb9df41.png)

- - -


# Event Loop、Call Stack、Web APIs
  - Event Loop - 事件循环
  - Call Stack - 调用栈
  - Render Step - 渲染节奏
  - Web APIs - 宿主环境

- - -

# Call Stack
* 函数被调用
* 创建执行上下文
    * a) 创建作用域链
    * b) 创建变量、函数和参数
    * c) 求this值
* 开始执行在执行上下文上 执行
    * ...
    * a) 遇到同步函数
    * b) 当前执行上下文入栈
    * c) 重复以上过程
    * ...
* 执行完成，往上一层 执行上下文  返回数据
* 从执行上下文栈pop出一个新的执行上下文执行

- - -

#Event Loop（异步）
![任务队列](68747470733a2f2f736661756c742d696d6167652e62302e7570616979756e2e636f6d2f3134392f3930352f313439393035313630392d356138616434376663653736345f61727469636c6578.png)
* 每个线程都有自己的event loop
* 浏览器可以有多个event loop，browsing contexts和web workers就是相互独立的
* 简略循环过程（script -> 清空微任务 -> 宏任务 -> 清空微任务 -> render -> 宏任务 -> 清空微任务 -> render ->...）
* 完整循环过程
  1. 从macrotask队列选择一个最老的task，如果没有，则执行microtask
  2. 将上面这个task设置为【正在运行的task】
  3. Run: 运行被选择的task
  4. 将【正在运行的task】置为null
  5. 从macrotask队列里移除前边运行的task
  6. 执行microtasks任务检查点
    1. 将microtask checkpoint的flag设为true。
    2. Microtask queue handling: 如果event loop的microtask队列为空，直接跳到第八步（Done）。
    3. 在microtask队列中选择最老的一个任务。
    4. 将上一步选择的任务设为event loop的currently running task。
    5. 运行选择的任务。
    6. 将event loop的currently running task变为null。
    7. 将前面运行的microtask从microtask队列中删除，然后返回到第二步（Microtask queue handling）。
    8. Done: 每一个environment settings object它们的 responsible event loop就是当前的event loop，会给environment settings object发一个 rejected promises 的通知。
    9. 清理IndexedDB的事务。
    10. 将microtask checkpoint的flag设为flase
  7. 更新渲染（Update the rendering）
  8. 如果这是一个worker event loop，但是没有任务在task队列中，并且WorkerGlobalScope对象的closing标识为true，
  则销毁event loop，中止这些步骤，然后进行 run a worker
  9. 返回第一步

* macrotask(宏任务) `task`，包含：
    * 整体代码script
    * setTimeout（标准4ms），setInterval，setImmediate（node）
    * I/O
    * UI交互事件
    * postMessage（MessageChannel）
* microtask(微任务) `job`，包含：
    * Promise
    * process.nextTick（node）
    * MutaionObserver

- - -

# Web APIs
前端：浏览器、node环境

- - -

# Render Step
    - Structure - 构建 DOM 树的结构
    - Layout - 确认每个 DOM 的大致位置（排版）
    - Paint - 绘制每个 DOM 具体的内容（绘制）

## 取消动画合并
    - 嵌套requestAnimationFrame
    - box.offsetWidth // 获取排版样式来打断渲染

## requestAnimationFrame和setTimeout的区别
    - setTimeout加入Event Loop，requestAnimationFrame加入渲染队列
    - 单位时间，setTimeout会执行多次，requestAnimationFrame严格遵守【执行一次渲染一次】
    - setTimeout(callback, 1000 / 60)可以模拟requestAnimationFrame，但不适合


- - -

# 交互事件触发
```js
let button = document.querySelector('#button');

button.addEventListener('click', function CB1() {
  console.log('Listener 1');

  setTimeout(() => console.log('Timeout 1'))

  Promise.resolve().then(() => console.log('Promise 1'))
});

button.addEventListener('click', function CB1() {
  console.log('Listener 2');

  setTimeout(() => console.log('Timeout 2'))

  Promise.resolve().then(() => console.log('Promise 2'))
});

// 手动点击：Listener 1, Promise 1, Listener 2, Promise 2, Timeout 1, Timeout 2
// button.click()：Listener 1, Listener 2, Promise 1,  Promise 2, Timeout 1, Timeout 2
// 解释：手动点击，浏览器不知道下面是否还会有绑定事件，故会先触发事件内的操作，
// 直接用代码click，浏览器的内部实现是把 2 个 listener 都同步执行
```