# jsonlike

## 参考

[JSON 不是合格的配置语言！](https://mp.weixin.qq.com/s?__biz=MzUxMzcxMzE5Ng==&mid=2247489214&idx=1&sn=97cf38903a96d4758ab69b5edcee8fae&chksm=f951a3fdce262aeb953b513b0f122a84a9e479d37049e511803d3b84b884015e0d8433b20718&mpshare=1&scene=1&srcid=0720vngZNMPrbHyVIt0ODaC4#rd)

---

## 目录

<details>
<summary>展开更多</summary>

* [`JSON.stringify`](#JSON.stringify)
* [`> 特殊值处理`](#特殊值处理)
* [`> 基本类型处理`](#基本类型处理)
* [`> 枚举属性处理`](#枚举属性处理)
* [`> toJSON`](#toJSON)

</details>

---

## 替代方案

- TOML
- HJSON
- HOCON
- YAML

---

## JSON.stringify

[参考](https://juejin.im/post/5decf09de51d45584d238319?utm_source=gold_browser_extension)

### 特殊值处理
> undefined、函数、symbol、NaN、Infinity、null

#### 作为 Object 键值

> undefined、函数、symbol会跳过序列化，
>
> NaN、Infinity、null会序列化为**null**

```js
JSON.stringify({
  a: "aaa",
  b: undefined,
  c: Symbol("dd"),
  fn() {
    return true;
  },
  d: NaN,
  e: Infinity,
  f: null,
});

// "{"a":"aaa","d":null,"e":null,"f":null}"
```

#### 作为 Array 元素

> 会序列化为 **null**

```js
JSON.stringify(["aaa", undefined, function aa() {
    return true
  }, Symbol('dd')]);

// ['aaa', null, null, null]
```

#### 作为单独值
> undefined、函数、symbol会序列化为undefined
>
> NaN、Infinity、null会序列化为**null**

```js
JSON.stringify(function a(){console.log('a')})
// undefined
JSON.stringify(undefined)
// undefined
JSON.stringify(Symbol('dd'))
// undefined

JSON.stringify(NaN)
// "null"
JSON.stringify(null)
// "null"
JSON.stringify(Infinity)
// "null"

```

### toJSON
> 如果对象含`toJSON`函数，JSON.stringify以函数返回值为准

```js
JSON.stringify({
  say: "hello JSON.stringify",
  toJSON: function() {
    return "hello world";
  },
});
// "hello world"
```

### 基本类型处理
> 包装类型会转为基本类型

```js
JSON.stringify([
  new Number(1),
  new String("false"),
  new Boolean(false),
]);

// "[1,"false",false]"
```

### 枚举属性处理
> 不可枚举的属性会跳过序列化

```js
JSON.stringify( 
  Object.create(
    null, 
    { 
      x: { value: 'json', enumerable: false }, 
      y: { value: 'stringify', enumerable: true } 
    }
  )
);

// "{"y":"stringify"}"
```
