#参考
  - https://www.jianshu.com/p/0983e69d58ec
  - ![运行机制](2954145-5bb92d1fbdb9df41.png)

- - -

#过程

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

#任务队列
![任务队列](68747470733a2f2f736661756c742d696d6167652e62302e7570616979756e2e636f6d2f3134392f3930352f313439393035313630392d356138616434376663653736345f61727469636c6578.png)
（宏任务 -> 清空微任务 -> render -> 宏任务 -> 清空微任务 -> render ->...）
* macrotask(宏任务) `task`，包含：
    * 整体代码script
    * setTimeout，setInterval，setImmediate（node）
    * I/O
    * UI交互事件
* microtask(微任务) `job`，包含：
    * Promise
    * process.nextTick（node）
    * MutaionObserver
