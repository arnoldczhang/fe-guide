# signal

> useState() => value + setter
> 
> useSignal() => getter + setter

## 简易实现

```js
let current;
export function createSignal(initialValue) {
    let value = initialValue;
    const subscribers = []; // 存储当前 signal 的依赖列表

    function get() {
        subscribers.push(current); // 跟踪依赖
        return value;
    }

    function set (newValue) {
        value = newValue;
        subscribers.forEach(sub => sub()); // 触发副作用
    }

    return [get, set];
}

export function createEffect(fn) {
    current = fn;
    fn();// fn 执行 会访问 get 函数，get 函数将 fn 放入依赖列表
    current = null;
}
```

## 用法

```js

```