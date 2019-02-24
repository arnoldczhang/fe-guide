# Shapes&Inline Caches

## 参考
- https://github.com/dt-fe/weekly/blob/master/62.%E7%B2%BE%E8%AF%BB%E3%80%8AJS%20%E5%BC%95%E6%93%8E%E5%9F%BA%E7%A1%80%E4%B9%8B%20Shapes%20and%20Inline%20Caches%E3%80%8B.md
- https://juejin.im/entry/5b7e108851882542c20f2018?utm_source=gold_browser_extension
- ![对象模型-对象](41808298-e8cce80c-770d-11e8-994b-1d6f30e2bfe3.png)
- ![对象模型-数组](41808308-0446ba5e-770e-11e8-895a-e2ed7231869d.png)

## 核心
  - js解析过程
    - 源码 -> parser（分析器）-> AST -> interpreter（解释器）-> bytecode（字节码）
    -> optimizing compiler（优化编辑器） -> optimized code（优化后的机器码）

## 隐藏类(Shapes)
- ![Shapes](41808322-2d1566ec-770e-11e8-98f7-ca87edeaa998.png)
- 创建对象后，属性值会存储到JSObject中，如果多个对象有相同结构，则可以共享Shape，
Shape会记录字段，然后找到并缓存对应的下标offset，下次在访问就可以省去找寻步骤
- ```js
  const a = {};
  a.x = 1; // Shape(x)会从Shape(empty)继承

  const b = { x: 1 }; // 由于b不是从空对象起，故Shape(x)不会存在继承
  ```
- 数组使用Object.defineProperty([], "0" , {...})监听后，会转成Dictionary Elements结构，比较浪费空间，用Proxy监听则不会有这问题
- js创建对象
  - const a = {};
  - const b = new Object();
  - const c = new f1();
  - const d = Object.create(null);
- 从引擎优化角度而言，`const a = {}`能共享Shape
```js
// redux推荐用Object.assign
let c = Object.assign({}, {x:1, y:2, z:3});
let d = Object.assign({}, c);
console.log("c and d have same map:", %HaveSameMap(c, d)); // true
```
 ```js
// 优先以相同的顺序初始化动态属性
function Point () {};
let p1 = new Point();
p1.a = 'a';
p1.b = 'b';
let p2 = new Point();
p2.a = 'aa';
p2.b = 'bb';
```

## 内联缓存(inline cache)
  - ValidityCell：与实例 shape 链接的直接原型中 ValidityCell 的链接
  - Prototype：属性的原型
  - Shape：实例的 shape
  - Offset：目标属性在原型中的偏移量

## 总结
- 尽量以相同方式、顺序初始化对象，这样会生成较少的 Shapes
- 尽量在构造函数中分配一个对象所有的属性
- 多次执行相同的方法的代码将会比执行很多只执行一次的方法要快
- 不要混淆对象的propertyKey与数组的下标
- 避免稀疏数组
- 请勿随意修改原型对象
- >31位的数字，会变成double类型，并创建一个对象，避免这种情况

