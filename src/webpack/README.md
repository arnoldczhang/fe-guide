# webpack

## 参考
- [tapable插件机制解析](https://segmentfault.com/a/1190000017420937)
- [webpack4js拆包](https://mp.weixin.qq.com/s/a946nG0oNYnDBMMwgtDBpA)
- [webpack4配置指南](https://mp.weixin.qq.com/s/cX7yuneDxDk8_NnMy3Bc8Q)
- [webpack4配置指南2](https://mp.weixin.qq.com/s/si4yq-M_JS0DqedAhTlKng)
- [webpack官方plugin文档](https://webpack.js.org/api/compilation-hooks#shouldgeneratechunkassets)

## 目录
<details>
<summary>展开更多</summary>

* [`webpack-3.8.1解析`](#webpack-3.8.1解析)
* [`webpack4`](#webpack4)
* [`开发调试`](#开发调试)
* [`treeshaking`](#treeshaking)
* [`tapable`](#tapable)
* [`其他`](#其他)

</details>

## webpack-3.8.1解析

- 主体
    - 支持webpack([conf1, conf2], callback)
    - webpackOptionsValidationErrors
      - 使用ajv校验options的json格式
    - Compiler
      - 编译器，生命周期会触发n多hooks...，插件要在不同hooks中做些callback
    - WebpackOptionsDefaulter
      - 填充默认配置项
    - NodeEnvironmentPlugin
      - 绑定文件内容变更的监控（输入、输出、监听、缓存）
    - compiler.apply.apply(compiler, options.plugins)
      - 执行plugins
    - WebpackOptionsApply
      - 定义打包出来的模板
        - JsonpTemplatePlugin
          - this-compilation
        - FunctionModulePlugin
          - compilation
        - NodeSourcePlugin
          - compilation
          - after-resolvers
        - LoaderTargetPlugin
          - compilation
          - normal-module-loader
        - EntryOptionPlugin
          - entry-option
        - ...

---

## 开发调试

### 调试
```js
// webpack.config.js放根目录，或者--config=指定路径
ndb ./node_modules/webpack/bin/webpack.js --inline --progress
```

### plugin开发

#### hook注入
```js
class CopyrightWebpackPlugin {
  // 调用plugin时，默认先执行apply
  apply(compiler) {
    const hooks = compiler.hooks;

    // webpack4+的写法
    if (hooks) {
      // 在`compile`hook，同步注入回调
      hooks.compile.tap('CopyrightWebpackPlugin', (compilation, cb) => {
        this.handleInit();
      });
    // webpack1-3的写法
    } else {
      compiler.plugin('compile', () => {
        this.handleInit();
      });
    }
  },
  handleInit() {
    // ...
  },
  
}

module.exports = CopyrightWebpackPlugin;

```

### plugin学习

#### WarnNoModeSetPlugin

**作用**

当mode字段未设值时有提示

```js
if (typeof options.mode !== "string") {
  const WarnNoModeSetPlugin = require("./WarnNoModeSetPlugin");
  new WarnNoModeSetPlugin().apply(compiler);
}
```

**调用位置**

/webpack/lib/WebpackOptionsApply.js

**hook**

```js
/*
compiler.hooks.thisCompilation -> tap('WarnNoModeSetPlugin', () => {
  compilation.warnings.push(new NoModeWarning)
})
*/
```

#### SetVarMainTemplatePlugin
**作用**


**调用位置**

/webpack/lib/LibraryTemplatePlugin.js

**hook**

```js
/*
chunkTemplate.hooks.renderWithEntry -> tap('SetVarMainTemplatePlugin', onRenderWithEntry)

mainTemplate.hooks.renderWithEntry -> tap('SetVarMainTemplatePlugin', onRenderWithEntry)

mainTemplate.hooks.globalHashPaths -> tap('SetVarMainTemplatePlugin', paths => {
  paths.push(this.varExpression)
})

mainTemplate.hooks.hash -> tap("SetVarMainTemplatePlugin", hash => {
  hash.update(/* ... */)
})
 */
```

#### xxx
**作用**
**调用位置**
**hook**

#### xxx
**作用**
**调用位置**
**hook**


### loader开发

---

## webpack4
[参考](https://juejin.im/entry/5b63eb8bf265da0f98317441)
[webpack4的24个实例](https://juejin.im/post/5cae0f616fb9a068a93f0613?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com#heading-1)

### 基本流程
![流程](https://www.processon.com/view/5cbd0db6e4b085d0107f438c)

### 相比webpack3
* 4多了mode字段，用于切换开发/生成环境
* 4支持了读取npm依赖的module字段，es6module
* 2、3的摇树会判断，如果方法有入参，或操纵了window，则不会摇掉，因为这些函数有副作用
  4的摇树默认会摇掉，如果sideEffect置为false，则不摇

### sideEffects
import {a} from xx -> import {a} from xx/a

### tree shaking
 [参考](https://zhuanlan.zhihu.com/p/32831172)

上面提到的由于副作用，所以不会摇掉的，可以参考下面例子，
V6Engine方法没有用到，但是修改了V8Engine的原型，如果摇掉会有问题

 ```js
 var V8Engine = (function () {
  function V8Engine () {}
  V8Engine.prototype.toString = function () { return 'V8' }
  return V8Engine
}())
var V6Engine = (function () {
  function V6Engine () {}
  V6Engine.prototype = V8Engine.prototype // <---- side effect
  V6Engine.prototype.toString = function () { return 'V6' }
  return V6Engine
}())
console.log(new V8Engine().toString())
 ```

### babel7
[参考](../babel/README.md)

### browserslist
[browserslist](https://github.com/browserslist/browserslist)

**用于在不同前端工具之间共享目标浏览器和 Node.js 版本的配置**

#### 使用方法
- 添加到 package.json
  ```json
  {
    "dependencies": {

    },
    "browserslist": [
      "> 1%",
      "last 2 version",
      "not ie <= 8"
    ]
  }
  ```
- 创建 .browserslist
  ```text
  # 所支持的浏览器版本
  > 1% # 全球使用情况统计选择的浏览器版本
  last 2 version # 每个浏览器的最后两个版本
  not ie <= 8 # 排除小于 ie8 以下的浏览器
  ```

### code splitting

**splitChunksPlugins**

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all', // 分割所有代码，包括同步代码和异步代码
      // chunks: 'async'，// 默认，分割异步代码
    }
  },
};
```

 ---

## treeshaking
- [基本原理](https://juejin.im/post/5a4dc842518825698e7279a9)
- [拓展](https://diverse.space/2018/05/better-tree-shaking-with-scope-analysis)
- [escope](https://github.com/estools/escope)

### 为什么只针对es6module

**静态分析**

不执行代码，从字面量上对代码进行分析

**ES6 module 特点***

- 依赖关系是确定的
- 只能作为模块顶层的语句出现
- import 的模块名只能是字符串常量
- import binding 是 immutable的

### rollup、webpack、google Closure对比

**rollup**
- unused函数能消除，未触达的代码没消除
- 配合uglifyjs能消除未触达的代码
- 只处理函数和顶层的import/export变量，不能把没用到的类的方法消除掉

**webpack**
- unused函数未消除，未触达的代码没消除
- 配合uglifyjs能消除未触达的代码
- 只处理函数和顶层的import/export变量，不能把没用到的类的方法消除掉
  ```js
  function Menu() {
  }

  Menu.prototype.show = function() {
  }

  var a = 'Arr' + 'ay'
  var b
  if(a == 'Array') {
      b = Array
  } else {
      b = Menu
  }

  b.prototype.unique = function() {
      // 将 array 中的重复元素去除
  }

  export default Menu;
  ```

**google Closure**
- unused函数、未触达的代码都能消除
- 对业务代码有侵入性，比如需要加特定的标注

**结论**
google Closure Compiler效果最好，不过使用复杂，迁移成本太高

---

## tapable
[参考](https://juejin.im/post/5cb43b3e5188251b2b20b7ed?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com#heading-18)

### SyncHook
- 比较像订阅发布，同步
- 注册事件是tap
- 事件执行是call
- 就像jquery中的add、fire方法，只不过这里是tap、call
- ```js
  arr.forEach(handler)
  ```

### SyncBailHook
- 主要解决的问题是条件阻塞
- 有熔断机制，前一个监听返回值非undefined，则停止
- ```js
  arr.some(handler)
  ```

### SyncWaterfallHook
- 前一个任务的执行结果，传递给后一个
- 类似redux中的compose
- ```js
  arr.reduce((pre, next) => next(pre))
  ```

### SyncLoopHook
- 能够执行多次
- 返回undefined则停止执行，返回非undefined则继续执行当前任务
- ```js
  let index = 0;
  while (index < this.tasks.length) {
    if (this.tasks[index]() === undefined) {
      index++;
    }
  }
  ```

### AsyncParralleHook
- 异步并行
- 注册事件是tapAsync
- 事件执行是callAsync
- 类似Promise.all
- ```js
  const tasks = this.tasks.map(task=>task(...param));
  Promise.all(tasks);
  ```

### AsyncParallelBailHook
- 只要返回真，都会进catch
- 无论结果，所有监听都会执行
- 绑定方式
  * tap，同SyncBailHook效果
  * tapSync，则遇到return true最终的callback不会执行
  * promise，则遇到rejcet(true)，则直接进入catch
- ```js
  Promise.all(tasks.map((task) => {
    return new Promise((resolve, reject) => {
      task().then((data) => {
        resolve(data);
      }, (err) => {
        err ? reject(err) : resolve();
      });
    });
  }))
  ```

### AsyncSeriesHook
- 异步任务，串行处理
- ```js
  const [first, ...others] = tasks;
  others.reduce((pre,next)=>{
    return pre.then(()=>next(...param))
  }, first());
  ```

### AsyncSeriesBailHook
- 返回值不是undefined，阻塞之后的监听

### AsyncSeriesWaterfallHook
- 用法和SyncWaterFallHook的用法一致

---

## 其他
- 使用 import()，需要dynamic-import插件 (https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import/)
- ![import](import-polyfill.png)
- [据说比babel快几十倍的compiler](https://github.com/swc-project/swc)
- [prepack-顾名思义代码预编译](https://prepack.io/)

