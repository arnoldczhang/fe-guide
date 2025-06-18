# vue2

## 1. 响应式系统（重点）

### 数据劫持

```js
function defineReactive(obj, key, value, customSetter) {
  observe(value);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend();
      }
      return value;
    },
    set(newValue) {
      // 用于修改props时的告警，但不阻拦
      if (customSetter) customSetter();
      if (newValue !== value) {
        value = newValue;
        observe(newValue);
        dep.notify();
      }
    },
  });
}

function observe(input) {
  if (!isObject(input)) return;
  return new Observer(input);
}

class Observer {
  constructor(input) {
    if (isArray(input)) {
      input.forEach((entity) => observe(entity));
    } else {
      const keys = Object.keys(input);
      keys.forEach((key) => defineReactive(input, key, input[key]));
    }
  }
}
```

### 依赖收集

```js
class Dep {
  constructor() {
    this.subs = [];
    this.target = undefined;
  }

  depend() {
    this.subs.push(Dep.target);
  }

  notify() {
    this.subs.forEach((sub) => sub.update())
  }
}
```

### 派发更新

- dep.notify() → watcher.update() → queueWatcher(this)
- $watch时监听，配置immediate可以立即触发

```js
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    Dep.target = this;
    this.vm[key];
    Dep.target = null;
  }

  update() {
    this.cb.call(this.vm, this.vm[this.key]);
  }
}
```

### 其他

#### 数组相关

- 对数组新增了类似`$push`的7个方法来实现数组的响应式

#### props

- **props其实支持子组件内直接修改**（没有阻拦），但是开发环境会告警
- 违反单向数据流的思想
- 建议用$emit

## 2. 虚拟dom和diff算法

1. 用vnode描述dom结构
2. 数据变化时生成新的vnode
3. 通过diff算法比较新旧vnode
   
   > 同级比较
   > 深度优先
   > 优先处理特殊情况（头头匹配和尾尾匹配）
   > 通过isSameNode判断节点可复用（key/icComment/tagName/细节属性）
4. 尽量复用vnode（移动/修改），减少dom操作

### diff算法

#### 优势

1. 对于首部和尾部插入的场景，算法复杂度降低（O(n) -> O(1)）
2. 对于倒序场景，算法复杂度降低（O(n²) -> O(n)）

#### 问题

1. 对于乱序无key场景，退化到O(n²)
2. 对于中间插数据的场景，仍需O(n)

```js
// 首尾匹配（四指针遍历）
function updateChildren(parent, oldElem, newElem) {
  let oldStartIndex = 0;
  let newStartIndex = 0;
  let oldEndIndex = oldElem.length - 1;
  let newEndIndex = newElem.length - 1;

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    const oldStartVnode = oldElem[oldStartIndex];
    const oldEndVnode = oldElem[oldEndIndex];
    const newStartVnode = newElem[newStartIndex];
    const newEndVnode = newElem[newEndIndex];

    // 优先处理高概率场景
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldElem[++oldStartIndex];
      newStartVnode = newElem[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldElem[--oldEndIndex];
      newEndVnode = newElem[--newEndIndex];
    } else (isSameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode);
      oldStartVnode = oldElem[++oldStartIndex];
      newEndVnode = newElem[--newEndIndex];
    } else (isSameVnode(oldEndVnode, newStartVnode)) {
       patchVnode(oldEndVnode, newStartVnode);
      oldEndVnode = oldElem[--newEndIndex];
      newStartVnode = newElem[++newStartIndex];
    } else if (/* 其他场景 */) {
      // ...
    }
  }
}
```

## 3. 模板编译

**三个阶段**

1. 解析阶段：模板转ast
2. 优化阶段：标记静态节点
3. 生成阶段：ast转成可执行的渲染代码

```js
function compile(template) {
  const ast = parse(template);
  optimize(ast);
  const code = generate(ast);
  return new Function(`with(this){ return ${code} }`);
}
```

## 4. 组件系统

- 选项合并（mixin、extends）
- 组件通信（props、eventEmitter、Provider/Inject）
- 动态组件：slot

## 5. 生命周期（简要）

- 创建阶段（beforeCreate、created）
- 更新阶段（beforeUpdated、updated）
- 销毁阶段（beforeDestory、destroyed）

## 6. 性能优化

#### key

- key是diff算法中识别vnode的唯一标识
- 主要用于vnode复用和状态保留
- v-for时有key时，可以精确定位vnode，否则会顺序错乱

#### 组件单一职责

#### 无状态组件

functional: true

#### 扁平化数据结构

#### 事件代理

```html
<!-- 好实践 -->
<div @click="handleProxyClick">
  <button :data-id="item.id" v-for="item in list">按钮{{ item.id }}</button>
</div>
```

#### 冻结不变数据

```js
this.largeData = Object.freeze(bigData)
```

#### v-if、v-for

- v-for比v-if有更高优先级
- 不必要的循环导致性能浪费
- 建议两者分层

```js
function render() {
  return _m(list, (item) => item.if ? renderNode(item) : null);
}
```

## 7. 问题

- 数组直接改索引、length，不会触发数据响应
- 给对象加新属性不会触发数据响应，要通过`Vue.set`
- 深度监听大对象会有性能瓶颈
