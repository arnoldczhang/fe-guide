# uuid

## 参考

- [uuid](https://juejin.cn/post/7033221241100042271)

---

## 版本

### v1

`uuid v1`是使用主机 MAC 地址和当前日期和时间的组合生成的，这种方式意味着 uuid 是匿名的

### V4

`uuid v4` 是随机生成的，没有内在逻辑，组合方式非常多（2¹²⁸），除非每秒生成数以万亿计的 ID，否则几乎不可能产生重复，如果你的应用程序是关键型任务，仍然应该添加唯一性约束，以避免 v4 冲突

### v5

通过提供两条输入信息（输入字符串和命名空间）生成的，这两条信息被转换为 uuid

---

## 可用模块

### uuid

```js
import { v4 as uuidv4 } from 'uuid';
let uuid = uuidv4(); 
console.log(uuid); // ⇨ 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx'
```

### crypto

> 需要node14.17.0

```js
const crypto = require('crypto');
let uuid = crypto.randomUUID();
console.log(uuid); // ⇨ 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx'
```

### nano ID

> 21位长度，类似uuidv4的重复率

```js
import { nanoid } from 'nanoid'
let uuid = nanoid();
console.log(uuid) // ⇨ "xxxxxxxx_xxxxxxxx-xxx"
```

---

## 测速

`randomUUID()`比`nanoid`快4倍，比`uuidv4`快12倍