## 基础面试题

## 目录
<details>
<summary>展开更多</summary>

* [`响应式方案`](#响应式方案)

</details>


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
[参考](https://github.com/forthealllight/blog/issues/13)

- 媒体查询
- 百分比
- rem
- vw/vh

#### 媒体查询
缺点：需要准备多套样式

```css
@media screen and (max-width: 960px){
}

@media screen and (max-width: 768px){
}

@media screen and (max-width: 550px){
}

@media screen and (max-width: 320px){
}
```

#### 百分比
缺点：
1. 所有尺寸都要重新换算
2. 各尺寸参照父元素的宽高标准不一

- width/height: 相对于直接父元素
- top和bottom 、left和right: 相对于直接非static父元素的高度/宽度
- padding/margin: 相对于直接父元素的width，与height无关
- border-radius: 相对于自身宽度

#### rem
缺点：font-size的设置必须在样式前

- 默认1rem = 16px
- rem只是制定等比缩放
- 配合媒体查询才能实现响应式

**步骤**

1. 给根元素设置字体大小，并在body元素校正
```css
html{font-size:100px;}
<!-- 1rem = 10px -->
html{font-size: 62.5%;}
body{font-size:14px;}
```
2. 绑定监听事件，dom加载后和尺寸变化时改变font-size
3. px自动转rem =》postcss

**转换工具**

```js
// 工具1：px2rem-loader
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'px2rem-loader',
        options: {
          remUni: 75,
          remPrecision: 8
        }
      }]
    }]
  }
};

// 工具2：postcss-loader
var px2rem = require('postcss-px2rem');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  postcss: function() {
    return [px2rem({remUnit: 75})];
  }
};
```

**设置font-size**

```js
!function(a,b){
  function c(){
    var b=f.getBoundingClientRect().width;
    b/k>540&&(b=540*k);
    var c=b/10;
    f.style.fontSize=c+"px",m.rem=a.rem=c
  }
var d,e=a.document,f=e.documentElement,
g=e.querySelector('meta[name="viewport"]'),
h=e.querySelector('meta[name="flexible"]'),
i=e.querySelector('meta[name="flexible-in-x5"]'),
j=!0,k=0,l=0,m=b.flexible||(b.flexible={});
if(g){
  console.warn("将根据已有的meta标签来设置缩放比例");
  var n=g.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
  n&&(l=parseFloat(n[1]),k=parseInt(1/l))
} else if(h){
  var o=h.getAttribute("content");
  if(o){
    var p=o.match(/initial\-dpr=([\d\.]+)/),
    q=o.match(/maximum\-dpr=([\d\.]+)/);
    p&&(k=parseFloat(p[1]),l=parseFloat((1/k).toFixed(2))),
    q&&(k=parseFloat(q[1]),l=parseFloat((1/k).toFixed(2)))
  }
}if(i&&(j="false"!==i.getAttribute("content")),!k&&!l){
  var r=(a.navigator.appVersion.match(/android/gi),a.chrome),
  s=a.navigator.appVersion.match(/iphone/gi),
  t=a.devicePixelRatio,u=/TBS\/\d+/.test(a.navigator.userAgent),v=!1;
  try{
    v="true"===localStorage.getItem("IN_FLEXIBLE_WHITE_LIST")
  }catch(w){
    v=!1
  }
  k=s||r||u&&j&&v?t>=3&&(!k||k>=3)?3:t>=2&&(!k||k>=2)?2:1:1,l=1/k
}if(f.setAttribute("data-dpr",k),!g)
  if(g=e.createElement("meta"),g.setAttribute("name","viewport"),g.setAttribute("content","initial-scale="+l+", maximum-scale="+l+", minimum-scale="+l+", user-scalable=no"),f.firstElementChild)
    f.firstElementChild.appendChild(g);
  else{
    var x=e.createElement("div");
    x.appendChild(g),e.write(x.innerHTML)
  }
  a.addEventListener("resize",function(){
    clearTimeout(d),d=setTimeout(c,300)
  },!1),
  a.addEventListener("pageshow",function(a){
    // persisted 是否来自缓存
    a.persisted&&(clearTimeout(d),d=setTimeout(c,300))
  },!1),
  "complete"===e.readyState?e.body.style.fontSize=12*k+"px":e.addEventListener("DOMContentLoaded",function(a){
    e.body.style.fontSize=12*k+"px"
  },!1),c(),m.dpr=a.dpr=k,m.refreshRem=c,
  m.rem2px=function(a){
    var b=parseFloat(a)*this.rem;
    return"string"==typeof a&&a.match(/rem$/)&&(b+="px"),b
  },m.px2rem=function(a){
    var b=parseFloat(a)/this.rem;
    return"string"==typeof a&&a.match(/px$/)&&(b+="rem"),b
  }
}(window,window.lib||(window.lib={}));
```

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
- attachEvent(event,listener)
- addEventListener(event, listener, useCapture = false)

onDoingthing冒泡阶段触发


