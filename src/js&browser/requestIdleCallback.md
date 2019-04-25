## 参考
1. https://mp.weixin.qq.com/s/LIfvU8j0gBVIFF8AYYtfFg
2. ![浏览器帧渲染-requestIdleCallback2](life-requestIdle.png)

## 帧-生命周期
1. 输入事件（touch、wheel、click、keypress）
2. js脚本
3. 帧事件（window.resize、scroll、media query、animation）
4. rAF（requestAnimationFrame、ObserverCallback、帧回调）
5. layout（重排，计算大小）
6. paint（重绘，更新样式）

## 线程

- JS线程
- UI渲染线程
- 事件线程
- 定时器触发线程
- HTTP请求线程
- ...

JS线程和渲染线程互斥，长时间JS执行导致页面卡顿

一帧执行的操作可[参考](./requestIdleCallback.png)

## microTask使用
```js
  function flush() {
    // ...
  };

  function useMutationObserver() {
    var iterations = 0;
    var observer = new MutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  };
```