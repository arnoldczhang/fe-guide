# node

[git](https://github.com/nodejs/node.git)

## 参考
- [源码分析](http://efe.baidu.com/blog/nodejs-module-analyze/)
- [node问题排查](https://zhuanlan.zhihu.com/p/41178823)
- [node性能提升！！](https://zhuanlan.zhihu.com/p/50055740)
- [node实际中的应用](https://juejin.im/post/5ca321f76fb9a05e5d09bb8a?utm_source=gold_browser_extension)
- [NodeJS和命令行程序](https://mp.weixin.qq.com/s/-jxYbmcbdt5IvpJC0BYOjg)

## 目录
<details>
<summary>展开更多</summary>

* [`好用的库`](#好用的库)
* [`require原理`](#require原理)
* [`eventLoop`](#eventLoop)
* [`GC`](#GC)
* [`循环引用`](#循环引用)
* [`最佳实践`](#最佳实践)
* [`异步错误`](#异步错误)
* [`手动打包指南`](#手动打包指南)

</details>

## 参数
* --async-stack-traces
  - 示例：node --async-stack-traces index.js
  - 异步堆栈跟踪

---

## 好用的库
- [监听文件夹变化](https://github.com/dt-fe/weekly/blob/master/59.%E7%B2%BE%E8%AF%BB%E3%80%8A%E5%A6%82%E4%BD%95%E5%88%A9%E7%94%A8%20Nodejs%20%E7%9B%91%E5%90%AC%E6%96%87%E4%BB%B6%E5%A4%B9%E3%80%8B.md)
- [调试工具-ndb](https://zhuanlan.zhihu.com/p/45851471)
- [JSON.stringify工具-fast-json-stringify](https://github.com/fastify/fast-json-stringify)
  - 预设字段类型，加速stringify
- [promise工具-bluebird](https://github.com/petkaantonov/bluebird)
  - V8 原生实现的 Promise 比 bluebird 这样第三方实现的 Promise 库要慢很多
  - 可以在代码中把全局的 Promise 换为 bluebird 的实现，比如
- [打包工具-ncc](https://zeit.co/blog/ncc)
- [图片压缩工具-sharp](https://github.com/lovell/sharp?utm_source=75weekly&utm_medium=75weekly)
- [检查库的两个版本间的diff](https://diff.intrinsic.com/)
- [npm源管理工具-nrm/yrm](https://juejin.im/post/5cc81991f265da036d79c8ca?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com)
- [搭建私有npm工具-verdaccio](https://juejin.im/post/5cc81991f265da036d79c8ca?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com)
  - ```js
    npm install -g verdaccio

    verdaccio
    // warn --- http address - http://localhost:4873/ - verdaccio/3.0.0

    nrm add verdaccio http://localhost:4873

    nrm use verdaccio

    npm adduser

    npm publish
    ```
- [DOM转canvas工具-html2canvas、dom-to-image](https://segmentfault.com/a/1190000019035021?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com&share_user=1030000000178452)

  ```js
  global.Promise = require('bluebird');
  ```
- [pipeline-stream](https://nodejs.org/dist/latest-v10.x/docs/api/stream.html#stream_stream_pipeline_streams_callback)
- [性能诊断node-clinic](https://github.com/nearform/node-clinic)
- [压测autocannon](https://github.com/mcollina/autocannon)

### eggjs
[参考](https://segmentfault.com/a/1190000018894188?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com&share_user=1030000000178452)

**进程管理**

+---------+           +---------+          +---------+
|  Master |           |  Agent  |          |  Worker |
+---------+           +----+----+          +----+----+
     |      fork agent     |                    |
     +-------------------->|                    |
     |      agent ready    |                    |
     |<--------------------+                    |
     |                     |     fork worker    |
     +----------------------------------------->|
     |     worker ready    |                    |
     |<-----------------------------------------+
     |      Egg ready      |                    |
     +-------------------->|                    |
     |      Egg ready      |                    |
     +----------------------------------------->|

**进程守护**

+---------+                 +---------+
|  Worker |                 |  Master |
+---------+                 +----+----+
     | uncaughtException         |
     +------------+              |
     |            |              |                   +---------+
     | <----------+              |                   |  Worker |
     |                           |                   +----+----+
     |        disconnect         |   fork a new worker    |
     +-------------------------> + ---------------------> |
     |         wait...           |                        |
     |          exit             |                        |
     +-------------------------> |                        |
     |                           |                        |
    die                          |                        |
                                 |                        |
                                 |                        |

**进程间通信（IPC）**

广播消息： agent => all workers
                  +--------+          +-------+
                  | Master |<---------| Agent |
                  +--------+          +-------+
                 /    |     \
                /     |      \
               /      |       \
              /       |        \
             v        v         v
  +----------+   +----------+   +----------+
  | Worker 1 |   | Worker 2 |   | Worker 3 |
  +----------+   +----------+   +----------+

指定接收方： one worker => another worker
                  +--------+          +-------+
                  | Master |----------| Agent |
                  +--------+          +-------+
                 ^    |
     send to    /     |
    worker 2   /      |
              /       |
             /        v
  +----------+   +----------+   +----------+
  | Worker 1 |   | Worker 2 |   | Worker 3 |
  +----------+   +----------+   +----------+

---

## 原理解析

### require原理

#### 简易步骤
- 路径分析
- 文件定位
- 编译执行

#### 解析顺序

![require加载机制](./require加载机制.png)

---

1. 系统缓存
  - 模块被执行之后会会进行缓存
2. 系统模块
  - 原生模块，省略了路径分析、文件定位
3. 文件模块
  - 路径优先级：. -> .. -> /
  - 文件类型优先级：.js -> .json -> .node
4. 目录做为模块
  - main，不存在报错：Error: Cannot find module 
5. node_modules目录加载
  - 从当前目录开始找，直到系统根目录

#### 核心解释
- [How`require()`ActuallyWorks](http://fredkschott.com/post/2014/06/require-and-the-module-system/)
- 关键
  - 核心 JavaScript 模块源代码是通过 process.binding('natives') 从内存中获取
  - 第三方 JavaScript 模块源代码是通过 fs.readFileSync 方法从文件中读取，根据不同扩展名，做不同读取校验
- 源代码
  1. 引用
    - ```js
      const http = require('http');
      ```
  2. 原型
    - ```js
      Module.prototype.require = function(path) {
        assert(path, 'missing path');
        assert(typeof path === 'string', 'path must be a string');
        return Module._load(path, this, /* isMain */ false);
      };
      ```
  3. Module._load
    - ```js
      Module._load = function(request, parent, isMain) {
        if (parent) {
          debug('Module._load REQUEST %s parent: %s', request, parent.id);
        }

        var filename = Module._resolveFilename(request, parent, isMain);

        var cachedModule = Module._cache[filename];
        // 有缓存则直接返回
        if (cachedModule) {
          return cachedModule.exports;
        }

        // 判断该模块是否为核心模块，如果则调用核心模块的加载方法NativeModule.require
        if (NativeModule.nonInternalExists(filename)) {
          debug('load native module %s', request);
          return NativeModule.require(filename);
        }

        // 如果不是核心模块，新创建一个 Module 对象
        var module = new Module(filename, parent);

        if (isMain) {
          process.mainModule = module;
          module.id = '.';
        }

        Module._cache[filename] = module;

        tryModuleLoad(module, filename);

        return module.exports;
      };
      ```
    4. Module._resolveFilename
      - ```js
        Module._resolveFilename = function(request, parent, isMain) {
          // ...
          var filename = Module._findPath(request, paths, isMain);
          if (!filename) {
            var err = new Error("Cannot find module '" + request + "'");
            err.code = 'MODULE_NOT_FOUND';
            throw err;
          }
          return filename;
        };
        ```
    5. [Module._findPath](https://github.com/nodejs/node/blob/v6.x/lib/module.js#L158)
    6. NativeModule.require
      - 如果是 built-in 模块 -> process.binding('模块名')
      - 判断 cache 中是否已经加载过，如果有，直接返回 exports
      - 新建 nativeModule 对象，然后缓存，并加载编译
    7. require用户自定义模块
      - tryModuleLoad
    8. Module.prototype.load
      - ```js
        NativeModule.wrap = function(script) {
          return NativeModule.wrapper[0] + script + NativeModule.wrapper[1];
        };

        NativeModule.wrapper = [
          '(function (exports, require, module, __filename, __dirname) { ',
          '\n});'
        ];

        NativeModule.prototype.compile = function() {
          var source = NativeModule.getSource(this.id);
          source = NativeModule.wrap(source);

          this.loading = true;

          try {
            const fn = runInThisContext(source, {
              filename: this.filename,
              lineOffset: 0,
              displayErrors: true
            });
            fn(this.exports, NativeModule.require, this, this.filename);

            this.loaded = true;
          } finally {
            this.loading = false;
          }
        };

        Module.prototype.load = function(filename) {
          debug('load %j for module %j', filename, this.id);

          assert(!this.loaded);
          this.filename = filename;
          this.paths = Module._nodeModulePaths(path.dirname(filename));

          var extension = path.extname(filename) || '.js';

          // 通过不同扩展名，选择不同的处理
          if (!Module._extensions[extension]) extension = '.js';
          Module._extensions[extension](this, filename);
          this.loaded = true;
        };

        // Native extension for .js
        Module._extensions['.js'] = function(module, filename) {
          var content = fs.readFileSync(filename, 'utf8');
          // _compile
          module._compile(internalModule.stripBOM(content), filename);
        };


        // Native extension for .json
        Module._extensions['.json'] = function(module, filename) {
          var content = fs.readFileSync(filename, 'utf8');
          try {
            module.exports = JSON.parse(internalModule.stripBOM(content));
          } catch (err) {
            err.message = filename + ': ' + err.message;
            throw err;
          }
        };


        //Native extension for .node
        Module._extensions['.node'] = function(module, filename) {
          return process.dlopen(module, path._makeLong(filename));
        };

        // ...
        Module.wrap = NativeModule.wrap;
        // ...
        Module.prototype._compile = function(content, filename) {
        // ...

        // create wrapper function
        var wrapper = Module.wrap(content);

        var compiledWrapper = vm.runInThisContext(wrapper, {
          filename: filename,
          lineOffset: 0,
          displayErrors: true
        });

        // ...
        var result = compiledWrapper.apply(this.exports, args);
        if (depth === 0) stat.cache = null;
        return result;
      };
        ```

### eventLoop
  - ![event_loop](node-event-loop.jpg)

### GC

#### 新生代、老生代
- 老生代
  - 使用大对象作为缓存，多次查询后进入老生代，使用三色标记 + DFS 的方式进行 GC，慢
- 新生代
  - 默认分配的内存64MB，由于使用Scavenge算法，实际可用32MB
  - node --max-semi-space-size=128 app.js // 修改内存上限，64或128较合理
  - 内存分配过大也会导致单次GC耗时久

### 循环引用

关键词
- Module._cache
- 没有循环引用

**首先理解Module的引用步骤：**

1. Check Module._cache for the cached module.
2. Create a new Module instance if cache is empty.
3. Save it to the cache.
4. Call module.load() with your the given filename.
   This will call module.compile() after reading the file contents.
5. If there was an error loading/parsing the file,
   delete the bad module from the cache
6. return module.exports

#### 例
```js
// a.js
var b = require('../test/b');
module.exports.a = 1;
console.log('a.js get b:' + b.b);

// b.js
var a = require('../test/a');
console.log('b.js get a:' + a.a);
module.exports.b = 2;
```

运行 node a.js
```js
b.js get a:undefined
a.js get b:2
```

#### 真实运行顺序
```js
// 由于不存在b实例，所以创建一个{}
var b = require('../test/b');
// 由于不存在a实例，所以创建一个{}
var a = require('../test/a');
// 此时a实例不存在a属性，所以undefined
console.log('b.js get a:' + a.a);
// b实例赋值b属性=2
module.exports.b = 2;
// 2
console.log('a.js get b:' + b.b);
// a实例赋值a属性=1
module.exports.a = 1;
```

### exports和module.exports
[参考](../js&browser/基本常识.md#amd/CommonJS)


### 异步错误

unhandledRejection

#### 处理
```js
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
```

#### 触发unhandledRejection

```js
// 1. 每次 Tick 完成后触发processTicksAndRejections
setTickCallback(processTicksAndRejections);

// 2. tock queue 运行到空时，调用 processPromiseRejections
function processTicksAndRejections() {
  let tock;
  do {
    // 运行Tock......
  } while (!queue.isEmpty() || processPromiseRejections());
  // ......
}

// 3. 依次触发unhandledRejection
function processPromiseRejections() {
  // ...
  while (pendingUnhandledRejections.length--) {
    if (!process.emit('unhandledRejection', reason, pendingUnhandledRejections.shift())) {
      emitWarning(uid, reason);
    }
  }
  // ...
};
```

#### 放入unhandledRejection

```js
// 1. node启动时，会执行setupTaskQueue
// 其中会调用listenForRejections方法
module.exports = {
  setupTaskQueue() {
    // Sets the per-isolate promise rejection callback
    listenForRejections();
    //.....
  }
};

// 2. listenForRejections监听&传入异常promise
function listenForRejections() {
  setPromiseRejectCallback(promiseRejectHandler);
}

// 3. 异常promise入队
function promiseRejectHandler(type, promise, reason) {
  switch (type) {
    case kPromiseRejectWithNoHandler:
      pendingUnhandledRejections.push(promise);
      break;
    // ...
  }
  // ...
}
```

#### 须知
- 每次 Tick 完成后，会执行并清空 Tock 队列
- 之后才会触发unhandledRejection回调

---

## 最佳实践

### 服务器瓶颈
* CPU
* 内存
* 磁盘
* I/O
* 网络

### 项目结构
* 组件化
* 组件内部分层
* 公共方法抽离成npm
* 分离app、server配置
* 配置文件分级

### 错误处理
* 使用await、promise
* 抽象通用错误类
```js
function CommonError(name, httpCode, description, isOperational) {
  Error.call(this);
  Error.captureStackTrace(this);
  this.name = name;
  //...在这赋值其它属性
};
CommonError.prototype.__proto__ = Error.prototype;
// 使用
throw new CommonError('abc');
```

---

## 手动打包指南
**css/less**

[css](../postcss/postcss.js)

**js**

uglify-js

**html**

[htmlparser2](../html/html.js)


