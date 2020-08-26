# vue

## 参考

- [vue2.0开发须知](https://juejin.im/post/5d9d386fe51d45784d3f8637)
- [一份超级详细的 Vue-cli3.0 使用教程](http://obkoro1.com/web_accumulate/accumulate/tool/%E4%B8%80%E4%BB%BD%E8%B6%85%E7%BA%A7%E8%AF%A6%E7%BB%86%E7%9A%84Vue-cli3.0%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.html#node%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82%EF%BC%9A)
- [ts + vue](https://segmentfault.com/a/1190000011878086?utm_source=tag-newest)
- [codemirror](https://codemirror.net/doc/manual.html)
- [vue 虚拟滚动](https://github.com/Akryum/vue-virtual-scroller#variable-size-mode)

## 目录

<details>
<summary>展开更多</summary>

* [`极简安装&启动`](#极简安装&启动)
* [`技巧`](#技巧)
* [`vue3`](#vue3)
* [`一些尝试`](#一些尝试)

</details>

## 极简安装&启动

### 安装 vue-cli

```js
npm install -g @vue/cli // 安装cli3.x
vue --version // 查询版本是否为3.x
```

### 新建

```js
vue create hello-cli3 
```

### 零配置启动/打包

```js
npm install -g @vue/cli-service-global

vue serve App.vue // 启动服务

vue build App.vue // 打包出生产环境的包并用来部署
```

### 启动图形化界面

```js
vue ui 
```

---

## 技巧

[vue 还能这样写](https://juejin.im/post/5eef7799f265da02cd3b82fe?utm_source=gold_browser_extension)

### slot

```vue
<!-- 组件 -->
<template>
  <!-- 新建了一个slot，叫header -->
  <div
    v-if="$slots.header"
    class="c-base-popup-header"
  >
    <slot name="header" />
  </div>
</template>

...

<!-- 使用 -->
<template>
  <comp>
    <template v-slot:header>
      ...
    </template>
  </comp>
</template>
```

### keep-alive

> vue 内置组件
>
> 会缓存包裹的第一个子组件实例，下次根据组件 id 从缓存中拿实例（如果存在的话）
>
> 注：如果没处理好，比如之前的组件实例没销毁，将会是内存泄漏的源头

```html
<keep-alive>
  <div>...其他组件</div>
</keep-alive>
```

### hook

```js
{
  mounted() {
    window.addEventListener('resize', this.$_handleResizeChart)
      // 通过hook监听组件销毁钩子函数，并取消监听事件
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', this.$_handleResizeChart)
      })
  },
}
```

---

## vue3

- [vue3-reactive](https://zhuanlan.zhihu.com/p/146097763)
- [vue3-compiler](https://zhuanlan.zhihu.com/p/150732926)

### compiler

#### 1. 提取动态 vnode

> vue3 有 `Block Tree` 和 `PatchFlag` 的概念
>
> `Block`相比普通VNode，多了`dynamicChildren`
>

```js
// Block仅包含最近子代的vnode
const block = {
    tag: Fragment,
    dynamicChildren: [
        {
          tag: 'p',
          children: item,
          // patchFlag用于标志静态节点还是动态节点，
          // 动态节点又分：1. 稳定动态节点 2. 不稳定动态节点
          // 稳定动态节点用优化后的算法，即提取dynamicChildren做更新
          // 不稳定动态节点还是使用之前的diff算法
          patchFlag: 1,
        }
    ],
}
```

**PatchFlag 有多种：**

- STABLE_FRAGMENT
- PROPS（还能指定 props 中的具体 key）
- CLASS
- STYLE
- TEXT
- FULL_PROPS（当props的key为动态值）
- NEED_PATCH（仅需更新ref属性）
- UNKEYED_FRAGMENT（没key的fragment）
- KEYED_FRAGMENT（有key的fragment）
- DYNAMIC_SLOTS（动态构建 `slots`时用到）

#### 2. 静态提升

> 包含 vnode 提升和 props 提升
>
> 好处是可以避免多次 diff，重复创建静态 vnode（props）

```js
// 静态vnode提升
const hoist1 = createVNode('p', null, 'text')

function render() {
    return (openBlock(), createBlock('div', null, [
        hoist1
    ]))
}

// 静态props提升
const hoistProp = { foo: 'bar', a: 'b' }

render(ctx) {
    return (openBlock(), createBlock('div', null, [
        createVNode('p', hoistProp, ctx.text)
    ]))
}
```

**哪些情况不会被静态提升？**

- 元素带有动态的 key 绑定（key 不同即使别的属性相同，做的也是完全替换，用不到 diff）
- 使用 ref 的元素（创建新元素当然要更新 ref，总不能指向老元素吧）
- 使用自定义指令的元素
- 动态属性，且非常量（也就是说仅包含常量的动态属性也会被静态提升）

#### 3. 预字符串化
> 大量连续的类似的vnode，与其做静态提升，不如预字符串化。
>
> 相对于静态提升：
> 1. 节省内存
> 2. 减少代码
>

**示例**

```html
<div>
    <p></p>
    <p></p>
    ...20 个 p 标签
    <p></p>
</div>
```

如果用静态提升
```js
const hoist1 = createVNode('p', null, 'text')
const hoist2 = createVNode('p', null, 'text')
// ...
const hoist20 = createVNode('p', null, 'text')
```
如果用预字符串化
```js
const hoistStatic = createStaticVNode('<p></p>...20个');
```

**哪些不会预字符串化？**

- 格类标签：caption 、thead、tr、th、tbody、td、tfoot、colgroup、col
- 含非标准[html属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)，不包括aria-
- 连续静态节点（含子节点）少于20个
- 连续含属性的静态节点（含子节点）少于5个

#### 4. Cache Event handler
> 绑定的事件做缓存处理

**示例**

```html
<Comp @change="a + b" />
```
默认编译为
```js
render(ctx) {
    return h(Comp, {
        onChange: () => (ctx.a + ctx.b)
    })
}
```
开启`prefixIdentifiers`和`cacheHandlers`后
```js
render(ctx, cache) {
    return h(Comp, {
        onChange: cache[0] || (cache[0] = ($event) => ctx.a + ctx.b)
    })
}
```


---

## 一些尝试

- [懒加载通用组件](./datapanel/README.md)
- [美化后的 tree 结构组件](./vue-pretty-tree/README.md)
