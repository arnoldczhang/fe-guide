# 面试整理

[TOC]

---

## 1. 前端基础

### 基础

- https://juejin.cn/column/6964717704712290317

### 深入&总结

- [闭包](./src/common.md#闭包)
- [promise细节](./src/promise.md)
- [暂时性死区](./src/common.md#let、const以及var的区别)
- [事件循环](../js&browser/并发模型-event_loop.md#宏任务和微任务)
- [线程&进程](../js&browser/现代浏览器.md#进程)
- [重绘重排](./src/common.md#重绘和回流)
- [GPU渲染和复合图层](./src/common.md#GPU加速)
- [VO和AO](../js&browser/并发模型-event_loop.md#执行上下文和作用域链)
- [作用域链](./src/common.md#执行上下文和作用域链)
- [盒模型](./src/common.md#盒模型)
- [get和post](../js&browser/页面过程与浏览器缓存.md)
- [mjs和cjs](../js&browser/esm.md)
- [跨域](../http/跨域.md)
- [性能优化](../js&browser/性能优化2020.md)
- [2020年的题](./src/common.md)

## 2. 手写源码

**无意义的重新实现**

- [new](./src/new.js)
- [promise](./src/promise.js)
- [bind](./src/bind.js)
- [缓存时效性](./src/缓存时效性.js)
- [防抖 - clearTimeout](./src/debounce.js)
- [节流 - 固定频率](./src/throttle.js)

**优点意思的**

- [LRU](../algorithm/leetcode/双向链表-LRU缓存机制.js)
- [eventBus](./src/eventBus.js)
- [模拟请求池](./src/模拟节流请求.js)
- [深拷贝](./src/深拷贝.md)
- [数据结构扁平化](./src/扁平数据转树状结构.js)
- [数据结构扁平化2](./src/扁平数据转树状结构2.js)
- 正则解析url
- [双指针-字符串全匹配](./src/字符串全匹配.js)
- [zookeeper增删改查](./src/zookeeper.js)
- [微信红包算法](../algorithm/leetcode/微信红包算法.js)
- [indexedDB读写](./src/indexedDB读写.js)
- [proxy响应式](./src/proxy响应式.js)

## 3. 打包工具

- [各打包工具区别](../webpack/各打包工具区别.md)
- [webpack 常用配置](../webpack/常用配置.md)
- [vite 常用配置](../vue/vite常用配置.md)
- [webpack加速优化](../webpack/README.md#加速优化)
- [webpack和rollup的treeshake的区别](../treeshake/README.md)
- [vite对比webpack的优势](../vue/README.md#vite)
- [yarn和pnpm](../npm&yarn/README.md#yarn&pnpm)
- [vite3解决巨量刷新](../vue/README.md#vite3对首次全量加载的优化)

## 4. 网络

- [网页请求展示全过程](../js&browser/页面过程与浏览器缓存.md#过程简述)
- [get和post](../js&browser/页面过程与浏览器缓存.md#GETvsPOST)
- [http](../http/README.md#总览)

## 5. 前端框架

- [react](../react/react19.md)
- [vue2](../vue/vue2.md)
- [vue3的treeshake](../vue/vue3.md#treeshake)
- [vue-router](../vue/vue3.md#router)
- [vue3 computed和watch](../vue/vue3.md#computed和watch)
- [vue3 prop和data](../vue/vue3.md#prop和data)
- [vue3 diff算法](../vue/vue3.md#diff算法)
- [vue3状态管理](../vue/状态管理.md)

## 6. 前端工程化

- [性能优化](../career/性能优化.md)
- [性能指标](../career/性能优化.md#性能指标)
- [图片优化方案](../js&browser/图片优化.md#优化措施)

## 7. 团队管理

- [前端架构](../career/前端基础架构.md)
- [领导力](../career/领导力.md)

## 8. 算法

- [算法精要](../algorithm/README.md)

## 9. 技术方案

- [离线包更新方案](./src/common.md#移动端离线包)
- [文件下载方案](../fe-interview/src/文件下载.md#总结)
- [版本发布后页面刷新方案](../fe-interview/src/版本发布后页面刷新方案.md)
- [最快下载100万条数据](../fe-interview/src/最快下载100万条数据.md)
- [灰度方案](../fe-interview/src/灰度方案.md)
- [前后端统一监控方案](../fe-interview/src/前后端统一监控方案.md)
- [白屏+卡顿检测方案](../js&browser/性能优化2019.md#白屏检测方案)
- [微前端方案](../microservice/微前端方案.md)
- [复杂组件方案](../fe-interview/src/复杂组件方案.md)

## 10. 业务

- [abest](../career/ab实验.md)
- [微前端](../microservice/微前端.md)
- [监控平台](../career/前端埋点和监控方案.md)
- [前端自动化测试](../career/前端自动化测试.md)
- [低代码平台](../career/低代码平台.md)
