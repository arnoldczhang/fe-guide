# 元编程

## 参考
  - https://segmentfault.com/a/1190000016133613

## Symbol、Reflect 和 Proxy

### Proxy
- new Proxy(target, handler);
```js
var handler = {
  get(t, key) {
    if (key === 'test') {
      return Reflect.get(t, key);
    } else {
      console.log('aaaa');
    }
  },
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.a; // aaaa
proxy.test // undefined
```

