# vue

## 参考
- [一份超级详细的Vue-cli3.0使用教程](http://obkoro1.com/web_accumulate/accumulate/tool/%E4%B8%80%E4%BB%BD%E8%B6%85%E7%BA%A7%E8%AF%A6%E7%BB%86%E7%9A%84Vue-cli3.0%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.html#node%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82%EF%BC%9A)
- [ts + vue](https://segmentfault.com/a/1190000011878086?utm_source=tag-newest)
- [codemirror](https://codemirror.net/doc/manual.html)
- [vue虚拟滚动](https://github.com/Akryum/vue-virtual-scroller#variable-size-mode)
- [vue3-reactive](https://zhuanlan.zhihu.com/p/146097763)

## 目录
<details>
<summary>展开更多</summary>

* [`极简安装&启动`](#极简安装&启动)
* [`技巧`](#技巧)
* [`一些尝试`](#一些尝试)

</details>

## 极简安装&启动

### 安装vue-cli
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

---

## 一些尝试
- [懒加载通用组件](./datapanel/README.md)
- [美化后的tree结构组件](./vue-pretty-tree/README.md)
