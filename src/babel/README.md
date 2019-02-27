# babel

## 目录
<details>
<summary>展开更多</summary>

* [`学习指南`](#学习指南)
* [`babel6解析`](#babel6解析)
* [`babel7解析`](#babel7解析)

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
// hook的参数，比如path，state都会定义在这里
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
// hook都可以在这两个文件里查



