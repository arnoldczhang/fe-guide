
## 参考
  - mdn：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
  - 阮一峰：http://es6.ruanyifeng.com/#docs/proxy
  - InterviewMap：https://github.com/InterviewMap/InterviewMap/blob/master/Framework/framework-zh.md

## 示例
```js
const obj = { arr: [{ name: 'a' }, { name: 'b' }, { name: 'c' }] };
const handler = {
  get(target, key) {
    console.log(key,1111);
    return key in target ? target[key] : null;
  },
  set(target, key, val) {
    console.log('val',val);
    if (val !== target[key]) {
      target[key] = val;
    }
  },
};

for (let key in obj) {
    let val = obj[key];
  if (typeof val === 'object') {
    obj[key] = new Proxy(val, handler);
  }
}
const proxy = new Proxy(obj, handler);
```

