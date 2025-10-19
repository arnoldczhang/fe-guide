# 面试整理

[TOC]

---

## 1. 前端基础

### 基础

- https://juejin.cn/column/6964717704712290317

### 八股

- [输入url到页面展示全过程](../js&browser/页面过程与浏览器缓存.md#过程简述)
- [线程&进程](../js&browser/现代浏览器.md#进程)
- [get和post](../js&browser/页面过程与浏览器缓存.md#GETvsPOST)
- [options](../js&browser/页面过程与浏览器缓存.md#options)
- [http各版本区别](../http/README.md#总览)
- [https](../http/README.md#https)
- [状态码](../http/README.md#常用状态码)
- [缓存机制](../js&browser/页面过程与浏览器缓存.md#缓存分类)
- [跨域&网络安全](../http/跨域.md#同源策略)
- [前端工程化](../career/前端工程化.md)
- [babel](../babel/README.md#总结)
- [postcss](../postcss/README.md#示例)
- [chrome插件](../chrome/插件开发.md)
- [echarts](../echart/README.md#总结)
- [重绘重排](./src/common.md#重绘和回流)
- [webpack 常用配置](../webpack/常用配置.md)
- [内存泄漏](../js&browser/内存管理.md#内存泄漏)
- [闭包](./src/common.md#闭包)
- [promise细节](./src/promise.md)
- [暂时性死区](./src/common.md#暂时性死区)
- [事件循环](../js&browser/并发模型-event_loop.md#宏任务和微任务)
- [GPU渲染和复合图层](./src/common.md#GPU加速)
- [VO和AO](../js&browser/并发模型-event_loop.md#执行上下文和作用域链)
- [作用域链](./src/common.md#执行上下文和作用域链)
- [盒模型](./src/common.md#盒模型)
- [mjs和cjs](../js&browser/esm.md)
- [B端和C端差异](../career/前端架构&技术方案.md#各端差异)

### css
- [响应式布局](./src/common.md#响应式方案)
- [垂直居中](../css-related/README.md#垂直居中)
- [margin塌陷](./src/common.md#margin塌陷)


## 手写源码

### 无意义的重新实现

- [数字千分位](./src/数字千分位.js)
- [new](./src/new.js)
- [flatten](./src/flatten.js)
- [call&apply&bind](./src/call&apply&bind.js)
- [缓存时效性](./src/缓存时效性.js)
- [防抖 - clearTimeout](./src/debounce.js)
- [节流 - 固定频率](./src/throttle.js)
- [深拷贝](./src/深拷贝.md#终局)

### 有点意思的

- [模拟promise](./src/promise.js)
- [eventBus](./src/eventBus.js)
- [eventBus发布订阅](./src/发布订阅.js)
- [useFetch](./src/useFetch.js)
- [LRU](../algorithm/leetcode/双向链表-LRU缓存机制.js)
- [模拟请求池](./src/模拟节流请求.js)
- [数组转树形结构](./src/数组转树形结构.js)
- [数据结构扁平化](./src/扁平数据转树状结构.js)
- [数据结构扁平化2](./src/扁平数据转树状结构2.js)
- 正则解析url
- [双指针-字符串全匹配](./src/字符串全匹配.js)
- [zookeeper增删改查](./src/zookeeper.js)
- [微信红包算法](../algorithm/leetcode/微信红包算法.js)
- [indexedDB读写](./src/indexedDB读写.js)
- [proxy响应式](./src/proxy响应式.js)

## 打包工具

- [webpack 常用配置](../webpack/常用配置.md)
- [打包格式-umd/esm等](../webpack/打包格式.md)
- [各打包工具区别](../webpack/各打包工具区别.md)
- [vite 常用配置](../vue/vite常用配置.md)
- [webpack加速优化](../webpack/README.md#加速优化)
- [webpack模块联邦](../webpack/README.md#webpack5)
- [webpack生命周期](../webpack/README.md#hook)
- [webpack和rollup的treeshake的区别](../treeshake/README.md)
- [vite对比webpack的优势](../vue/README.md#vite)
- [yarn和pnpm](../npm&yarn/README.md#yarn&pnpm)
- [vite3解决巨量刷新](../vue/README.md#vite3对首次全量加载的优化)

## 前端框架

- [MV*区别](./src/common.md#mvX)
- [react](../react/react19.md)
- [vue2](../vue/vue2.md)
- [vue3 treeshake](../vue/vue3.md#treeshake)
- [vue-router](../vue/vue3.md#router)
- [vue3 computed和watch](../vue/vue3.md#computed和watch和watchEffect)
- [vue3 prop和data](../vue/vue3.md#prop和data)
- [vue3 diff算法](../vue/vue3.md#diff算法)
- [vue3 状态管理](../vue/状态管理.md)

## 前端工程化

- [前端工程化](../career/前端工程化.md)
- [性能优化](../career/性能优化.md)
- [性能指标](../career/性能优化.md#性能指标)
- [图片优化方案](../js&browser/图片优化.md#优化措施)
- [B端和C端差异](../career/前端架构&技术方案.md#各端差异)

## 团队管理

- [前端架构](../career/前端基础架构.md)
- [领导力](../career/领导力.md)

## 算法

- [算法精要](../algorithm/README.md)

## 技术方案

- [离线包更新方案](./src/common.md#移动端离线包)
- [文件下载方案](../fe-interview/src/文件下载.md#总结)
- [版本发布后页面刷新方案](../fe-interview/src/版本发布后页面刷新方案.md)
- [最快下载100万条数据](../fe-interview/src/最快下载100万条数据.md)
- [灰度方案](../fe-interview/src/灰度方案.md)
- [前后端统一监控方案](../fe-interview/src/前后端统一监控方案.md)
- [监控sdk设计](../fe-interview/src/前后端统一监控方案.md#sdk设计)
- [白屏+卡顿检测方案](../js&browser/性能优化2019.md#白屏检测方案)
- [微前端方案](../microservice/微前端方案.md)
- [通用组件封装方案](../career/前端代码质量.md#组件封装)
- [表格](../fe-interview/src/复杂组件方案.md)
- [表单](../fe-interview/src/复杂表单解决方案.md)
- [sdk搭建方案](./src/sdk搭建方案.md)
- [前端物料库搭建方案](https://mp.weixin.qq.com/s/MUz3JMhmV1W2hC-YaGEiKQ)
- [i18n方案](./src/i18n方案.md)
- [弱网可用性](./src/弱网可用性.md)

## 业务

- [abest](../career/ab实验.md)
- [微前端](../microservice/微前端.md)
- [监控平台](../career/前端埋点和监控方案.md)
- [前端自动化测试](../career/前端自动化测试.md)
- [低代码平台](../career/低代码平台.md)
