## 基础面试题

### ==和===
- === 不需要进行类型转换，只有类型相同并且值相等时，才返回 true.
- == 如果两者类型不同，首先需要进行类型转换。具体流程如下:
  * 首先判断两者类型是否相同，如果相等，判断值是否相等；
  * 如果类型不同，进行类型转换；
  * 判断比较的是否是 null 或者是 undefined, 如果是, 返回 true；
  * 判断其中一方是否为 boolean, 如果是, 将 boolean 转为 number 再进行判断；
  * 判断两者类型是否为 string 和 number, 如果是, 将字符串转换成 number；
判断其中一方是否为 object 且另一方为 string、number 或者 symbol , 如果是, 将 object   * 转为原始类型再进行判断。

### [] == ![]

数组转数字方法

Number(array.toString())

```js
Number([]) === 0
```

### let、const 以及 var 的区别
- var会变量提升
- var可重复声明
- let、const声明在块级作用域，var声明在局部/全局作用域
-  let、const存在暂时性死区
  * 暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量
  * ```js
    typeof x; // ReferenceError(暂时性死区，抛错)
    let x;

    typeof y; // 值是 undefined, 不会报错
    ```

### 函数声明&变量声明
- 函数会首先被提升，然后才是变量
- 换言之，无论两者（书面上）的声明顺序如何，优先读取到的是函数声明
- 原因如下

#### 执行环境
包括创建 + 执行阶段

**创建过程**

1. 初始化arguments对象，及形参
2. 扫描函数声明，并进行处理
  - 如果该函数名在变量对象中已存在，则覆盖已存在的函数引用
3. 扫描变量声明，并进行处理
  - 如果该变量名在变量对象中已存在，为防止与函数名冲突，则跳过，不进行任何操作

```js
executionContextObj = {
  'variableObject': {...}, //函数的arguments、参数、函数内的变量及函数声明
  'scopeChian': {...}, //本层变量对象及所有上层执行环境的变量对象
  'this': {}
};
```

### this

```js
var number = 5;
var obj = {
    number: 3,
    fn1: (function () {
        var number;
        this.number *= 2;
        number = number * 2;
        number = 3;
        return function () {
            var num = this.number;
            this.number *= 2;
            console.log(num);
            number *= 3;
            console.log(number);
        }
    })(),
}
var fn1 = obj.fn1;
//  10 9
fn1.call(null);
// 3 27
obj.fn1();
// 20
console.log(window.number);
```

### 统计数组成员重复个数
```js
const arr = [0, 1, 1, 2, 2, 2];
const count = arr.reduce((t, c) => {
    t[c] = t[c] ? ++t[c] : 1;
    return t;
}, {});
// count => { 0: 1, 1: 2, 2: 3 }

```

### vue和react中key的作用
- 和性能好坏无关
- 相同的key可以复用节点（仅做textContent变更），
  否则只能insert/append，remove，开销大些

### flex布局
**flex-basis**

- 设置或检索弹性盒伸缩基准值
- 用法
  * flex-basis: 120px;
  * flex-basis: auto;
  * flex-basis: 10%;

**flex-shrink**

- 元素收缩比
- 用法
  * flex-shrink: 0; // 不收缩
  * flex-shrink: 1; // 默认值
- 计算方式
  ```js
  const 元素总宽度和 = '各元素 flex-basis 之和'
  const 超出宽度 = 元素总宽度和 - 容器宽度
  const 当前元素宽度占比 = (当前元素 flex-basis * 当前元素 flex-shrink) / (所有元素各自 flex-basis * flex-shrink 之和)
  const 当前元素最终宽度 = 当前元素 flex-basis - (超出宽度 * 当前元素宽度占比)
  ```
- 实例
  ```html
  <div id="content">
    <!-- 宽度105.72 -->
    <div class="box">A</div>
    <div class="box">B</div>
    <div class="box">C</div>
    <!-- 宽度91.42 -->
    <!-- 120 - (120 * 5 - 500) * 120 * 2 / (120 * 3 * 1 + 120 * 2 * 2) -->
    <div class="box1">D</div>
    <div class="box1">E</div>
  </div>
  <style type="text/css">
    #content {
      display: flex;
      width: 500px;
    }

    #content div {
      flex-basis: 120px;
    }

    .box { 
      flex-shrink: 1;
    }

    .box1 { 
      flex-shrink: 2; 
    }
  </style>
  ```

### 响应式方案
TODO

### setTimeout原理
[参考](../js&browser/基本常识.md#setTimeout)

### onload和DOMContentLoaded

#### DOMContentLoaded
- HTML5事件
- 初始的HTML文件被完整读取时触发
- 不理会css、图片、iframe的完成加载

#### onload
- DOM事件
- 所有内容加载完，包括js中的js、css、图片、iframe
- 不包括请求

### https原理，如何判断私钥合法
TODO

### 事件触发过程
TODO
