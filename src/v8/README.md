# v8

## 参考
- https://mp.weixin.qq.com/s/pv_4YRo6KjLiVxLViZTr2Q
- https://mp.weixin.qq.com/s/hARJrq_baizVkW5SPUl81Q
- [v8优化骚套路](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers)
- [对象模式](https://zhuanlan.zhihu.com/p/25069272)
- [v8全文档](https://v8.js.cn/docs/)

## 并发标记(mark-and-sweep)
- 三色标记
  - 白色：收集器还未发现该对象
  - 灰色：收集器发现，并已推到标记工作表
  - 黑色：对象从标记工作表弹出，并已访问其全部字段
  - 当没有灰色对象时，标记结束。所有剩余的白色对象都可以安全地被回收。

## 新v8架构的优化
- Ignition 译码器
  - 较小的性能抖动
  - 提高启动速度
  - 改进基线性能
- 减少内存使用
- 支持新的语言特性

## 字节码和机器码
- [字节码](https://zhuanlan.zhihu.com/p/28590489)
- ![字节码](字节码.png)


## 部分原生方法解析

### forEach
- 每次循环会做in判断导致比for-loop慢


## v8调试方式 - By node
- --print-bytecode // 打印字节码
- --trace-gc // 查看内存
- --trace_gc_verbose // 查看内存明细
- --allow-natives-syntax // 允许使用V8 引擎内部调试函数








