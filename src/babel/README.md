# babel

## 目录
<details>
<summary>展开更多</summary>

* [`学习指南`](#学习指南)
* [`babel6解析`](#babel6解析)
* [`babel7解析`](#babel7解析)
* [`ast解析`](#ast解析)
* [`babel-macro`](#babel-macro)

</details>

## 参考
- [babel-plugins-repository](https://github.com/babel/minify.git)
- [babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)

## 学习指南
- babel-handbook
- https://github.com/babel/minify/packages/...

## babel6解析

### babel.transform(code, opts)

1. babel-core/lib/api/node.js
```js
exports.transform = pipeline.transform.bind(pipeline);
```
2. babel-core/lib/transformation/pipeline.js
```js
Pipeline.prototype.transform = function transform(code, opts) {
  var file = new _file2.default(opts, this);
  return file.wrap(code, function () {
    file.addCode(code);
    file.parseCode(code);
    return file.transform();
  });
};
```
3. babel-core/lib/transformation/file/index.js
```js
function File(opts) {
  // 额外参数处理，plugins处理见[4]
  this.initOptions(opts);
  // ...
  this.buildPluginsForOptions(opts);
  // ...
  opts.presets.forEach((preset) => {
    this.buildPluginsForOptions(preset);
  });
};

File.prototype.buildPluginsForOptions = function buildPluginsForOptions(opts) {
  // ...
  var currentPluginPasses = [];
  opts.plugins.forEach((plugin) => {
    // ...
    // 这里相当于把所有plugins的处理（比如pre、post、visitor）归到临时队列
    // presets里的也是plugins，同样处理归到临时队列
    currentPluginPasses.push(pluginMainResolver.bind(this, pluginOptions));
  });
  // 临时队列push到plugins队列
  this.pluginPasses.push(currentPluginPasses);
};

File.prototype.addCode = function addCode(code) {
  code = (code || "") + "";
  code = this.parseInputSourceMap(code);
  this.code = code;
};

File.prototype.parseCode = function parseCode() {
  // this.parseShebang会把首行的#!xxxx提取出来，用于系统bash执行
  // 比如#!/bin/sh
  this.parseShebang();
  var ast = this.parse(this.code);
  this.addAst(ast);
};

File.prototype.parse = function parse(code) {
  // ...
  var ast = require("babylon").parse(code, this.opts.parserOpts || this.parserOpts);
  return ast;
};

File.prototype.transform = function transform() {
  for (var i = 0; i < this.pluginPasses.length; i++) {
    var pluginPasses = this.pluginPasses[i];
    // 提取所有plugins里的pre，依次触发
    // pre里的this指向当前plugin，第一个入参file指向当前transform的文件
    this.call("pre", pluginPasses);
    this.log.debug("Start transform traverse");

    var visitor = _babelTraverse2.default.visitors.merge(this.pluginVisitors[i], pluginPasses, this.opts.wrapPluginVisitorMethod);
    (0, _babelTraverse2.default)(this.ast, visitor, this.scope);

    this.log.debug("End transform traverse");
    // 提取所有plugins里的post，依次触发
    // post里的this指向当前plugin，第一个入参file指向当前transform的文件
    this.call("post", pluginPasses);
  }

  return this.generate();
};
```
4. babel-core/lib/transformation/file/options/option-manager.js
```js
OptionManager.normalisePlugins = function normalisePlugins(loc, dirname, plugins) {
  return plugins.map(function (val, i) {
    var plugin = void 0,
        options = void 0;

    if (!val) {
      throw new TypeError("Falsy value found in plugins");
    }

    if (Array.isArray(val)) {
      plugin = val[0];
      options = val[1];
    } else {
      plugin = val;
    }

    var alias = typeof plugin === "string" ? plugin : loc + "$" + i;
    // ...

    plugin = OptionManager.normalisePlugin(plugin, loc, i, alias);

    return [plugin, options];
  });
};

OptionManager.normalisePlugin = function normalisePlugin(plugin, loc, i, alias) {
  // ...
  plugin = OptionManager.memoisePluginContainer(plugin, loc, i, alias);
  // ...
};

OptionManager.memoisePluginContainer = function memoisePluginContainer(fn, loc, i, alias) {
  // ...
  if (typeof fn === "function") {
    // 这里的context拿的是babel-core/lib/api/node.js，所有返回值
    // context.type属性拿的是babel-types返回值
    obj = fn(context);
  }
  // ...
};
```

### babelTraverse(parent, opts, scope, state, parentPath)
1. babel-traverse/lib/index.js
```js
function traverse(parent, opts, scope, state, parentPath) {
  if (!parent) return;
  if (!opts) opts = {};

  if (!opts.noScope && !scope) {
    if (parent.type !== "Program" && parent.type !== "File") {
      throw new Error(messages.get("traverseNeedsParent", parent.type));
    }
  }

  visitors.explode(opts);

  traverse.node(parent, opts, scope, state, parentPath);
}

traverse.node = function (node, opts, scope, state, parentPath, skipKeys) {
  // ...
  const keys = t.VISITOR_KEYS[node.type];
  const context = new context2.default(scope, opts, state, parentPath);
  // ...
  keys.forEach((node, key) => {
    // ...
    // context见3
    if (context.visit(node, key)) return;
  });
};
```
2. babel-traverse/lib/visitors.js
```js
function explode(visitor) {
  // 1. hook名做split("|")，分别赋值原fns
  // 例：'Identifier|BinaryExpression': (path) { ... }
  // 转换成
  // Identifier(path) { ... }
  // BinaryExpression(path) { ... }

  // 2. 校验visitor类型、key是否该ignore，或是否在babel-types.TYPES里

  // 3. hook如果是function，转成 hookName: { enter: hookFn }

  // 4. 如果hook有enter或exit，但不是数组，转成 visitor[hookName].enter = [visitor[hookName].enter]

  // 5. 如果hookName属于virtualTypes（babel-traverse/lib/path/lib/virtual-types.js），将
  // virtualTypes[hookName]加入virtualTypes[hookName].types的hook处理队列中

  // 6. deprecratedKey检查
};
```
3. babel-traverse/lib/path/context.js
// hook的入参，比如path，state都会定义在这里
```js
function visit() {
  // ...各种黑名单、标记检测
  if (this.call("enter") || this.shouldSkip) {
    return this.shouldStop;
  }
  // ...
  _index2.default.node(this.node, this.opts, this.scope, this.state, this, this.skipKeys);
  this.call("exit");
  return this.shouldStop;
}

function call(key) {
  // ...找到hook
  const fn = this.opts[key];
  // ...
  if (this.shouldStop || this.shouldSkip || this.removed) return true;
  // ...hook的参数path就是context实例，参数state和this都指向实例的state
  return fn.call(this.state, this, this.state);
}
```
4. babel-types/lib/definitions/core.js和babel-types/lib/definitions/flow.js
hook都可以在这两个文件里查
5. @babel/core/node_modules/@babel/types/lib/index.d.ts
和 @babel/core/node_modules/@babel/types/lib/index.js
types可以在这两个文件里查

---

## babel7解析

### 文件<->方法变更
1. @babel/core
  * transform
  * transformSync
  * transformAsync
2. @babel/generator
  * default

### options
[参考](https://babeljs.io/docs/en/options)

#### 常用key

**ast**

是否生成ast

默认false，返回null

**code**

是否生成code

默认true

**envName**

环境变量

默认process.env.BABEL_ENV || process.env.NODE_ENV || "development"

**sourceMap**

**babelrc**

默认true

**configFile**

默认path.resolve(opts.root, "babel.config.js")

---

## ast解析

### path
path是所有hook的第一个入参，结构如下：

path
- node
  * 当前ast节点的主体信息
  * 结构：
  ```js
  interface BaseNode {
    leadingComments: ReadonlyArray<Comment> | null;
    innerComments: ReadonlyArray<Comment> | null;
    trailingComments: ReadonlyArray<Comment> | null;
    start: number | null;
    end: number | null;
    loc: SourceLocation | null;
    type: Node["type"];
  }
  ```
  * 以上是基础字段，不同hook的path.node会有自己的扩展，
  不过都继承于此
- scope
  * 当前词法作用域
  * 结构：
  ```js
  {
    path: path,
    block: path.node,
    parentBlock: path.parent,
    parent: parentScope,
    bindings: [...], 
  }
  ```
- type

#### 常用方法
- path.get(key)
- path.isXXXX() or path.get(key).isXXXX()

### 常用hook

#### CallExpression
**作用**

捕获(对象)方法的调用

**参考**

[CallExpression](https://babeljs.io/docs/en/next/babel-types.html#callexpression)

**path.node常用字段**

* callee
* arguments

**示例**
```js
aa();
aa.bb();
```

#### VariableDeclarator

#### ImportDeclaration

#### MemberExpression

#### FunctionDeclaration

#### ForInStatement

**常用字段**

* left
* right

---

## babel-macro
编译阶段预处理js逻辑
[babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros)

**注**
仅针对静态编译的内容

### 使用方法
1. 安装macros
```js
npm install --save-dev babel-plugin-macros

// 如果需要其他.macros，需要手动安装
// .macros可以参考[awesome-babel-macros](https://github.com/jgierer12/awesome-babel-macros)
npm install --save-dev ms.macro
```
2. 配置使用macros
```js
const { ast } = require('babel-core').transform(input, {
  // ...
  plugins: [
    // ...
    'macros',
  ],
});
```
3. 代码使用
```js
import ms from 'ms.macro';

const ONE_DAY = ms('1 day');
```
4. 编译后输出的内容
```js
var ONE_DAY = 86400000;
```



