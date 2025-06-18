# vue3

## 参考

- [react16、vue2、vue3 diff算法对比](https://juejin.cn/post/7116141318853623839)
- [vue3-管理端开箱即用1](https://github.com/fantastic-admin/basic)
- [200行实现diff](https://lazamar.github.io/virtual-dom/)

## 目录

[TOC]

---

## 框架考虑点

- 特性开关（按需引用）
- treeshake
- 全局错误处理
- ts支持

### treeshake

> rollup 默认会基于 esm 做树摇，但是对于函数调用，由于不确定是否有副作用（比如改全局变量），不会自动treeshake，
> 
> 可以通过 **__PURE__**关键词标记不含副作用，可以正常 treeshake。

```js
import { foo } from './utils
/*#__PURE__*/ foo()

export const isHtml = /*#__PURE__*/ isHtmlFn();
```

## 

---

## 组件二次封装

```vue
<template>
    <!-- 承接原组件$attrs，并适配当前组件 -->
  <el-table v-bind="attrs">
    <!-- 承接原组件$slots（动态插槽） -->
    <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots">
      <!-- 插槽携带数据一并承接 -->
      <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
  </el-table>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, useSlots, useAttrs } from 'vue';

const $slots = useSlots();
const $attrs = useAttrs();

const attrs = computed(() => ({
  ...$attrs,
  // 去掉不希望透传的属性
  aa: undefined,
}));

// 新增props
const props = defineProps({
  aaaa: {
    type: String,
    default: 'div',
    // 自定义校验器
    // validator: (val: any) => true,
  },
});

// 定义emit
const emit = defineEmits<{
  (e: 'aaEvent', value: any): void;
}>();


onMounted(() => {
  // 挂载
});

onUnmounted(() => {
  // 卸载
});
</script>
```

---

## 开发者调试

### console格式化

> Settings -> Preferences -> Enable custom formatters

---

## 宏方法

[安装宏方法](https://github.com/antfu/unplugin-auto-import)

### watch

**flush**

> flush: 'post' 表示放到下一个微任务中执行 watch callback

```typescript
const obj = ref(/**/);

watch(obj, (newObj, oldObj) => {
  // 回调
}, {
  flush: 'sync', // 有 post/pre/sync
});
```

**onInvalidate**

> 在当前副作用函数过期时执行，避免重复触发

```typescript
const obj = ref(/**/);

let finalData;

watch(obj, async (newObj, oldObj, onInvalidate) => {
    let expired = false;
  onInvalidate(() => {
    expired = true;
  });

  const res = await fetch('/path/to/request');

  // 回调过期时，跳过
  if (expired) {
    return;
  }

  // 否则，正常赋值
  finalData = res;
});
```

---

## 原理

### 普通对象vs异质对象

**普通对象**

> 1. 含对象必要的内部方法，比如[[GetPrototypeOf]]、[[SetPrototypeOf]]等
> 2. 含原生实现的[[Call]]
> 3. 含原生实现的[[Construct]]

**异质对象**

> 非普通对象

### 数组

**读取**

- arr[0]
- arr.length
- **不改变**数组的原型方法（concat、find、some）
- for...in
- for...of

**写入**

- arr[100] = 1
- arr.length = 100
- 栈方法：push、pop
- 修改原数组方法：splice、sort

### Set和Map

- map.set响应式数据会污染原数据

---

## 插件

### unplugin-vue-macros

> vue3原型方法拓展

[参考](https://vue-macros.sxzz.moe/guide/getting-started.html) 

### unplugin-vue-define-options

> 新增`defineOptions`，可在setup里定义组件基本信息（不用单独搞个<script>定义组件name了）

[参考](https://www.npmjs.com/package/unplugin-vue-define-options)

---

## tsx

### PropType

> 用于在用运行时 props 声明时给一个 prop 标注更精确的类型定义
> 
> 参考[vue3-PropType](https://cn.vuejs.org/api/utility-types.html#proptype-t)

```tsx
import { defineComponent, PropType } from 'vue';

defineComponent({
  props: {
    a: {
      type: Object as PropType<具体类型>,
      required: true,
    },
    b: {
      type: Function as PropType<(arg: 具体类型) => void>,
    },
  },
})
```

### inject/provide

```tsx

```

---

## router

### hash和history

|       | hash       | history            |
| ----- | ---------- | ------------------ |
| 事件监听  | hashchange | pushstate、popstate |
| 区别    | #xxx       | /path/a/b          |
| 服务端配置 | 无需支持       | nginx要配置try_files  |

## computed和watch

### 区别

|      | computed    | watch                  |
| ---- | ----------- | ---------------------- |
| 异步   | 不支持         | 支持                     |
| 缓存机制 | 依赖未变化，不重复计算 | 每次变化都计算，需自行优化（deep、节流） |
| 返回值  | 计算后的响应值     | 无                      |
| 数据关系 | 生成新值        | 监听变化                   |
|      |             |                        |

### computed原理

- 底层是一个class，设置了针对value属性的getter/setter

- 有一个变更标记（使用了vue3 reactive包里的ReactiveEffect），当依赖变化时需要重新计算值，否则用缓存值

- 有一个依赖收集函数，收集computed里用到的依赖，变化时，更新变更标记

```js
function computed(getter, setter) {
  const ref = new ComputedImpl(getter, setter);
  return ref;
}

class ComputedImpl {
  constructor(getter, setter) {
    this.getter = getter;
    this.setter = setter;
    this._dirty = true;
    this.trigger = ReactiveEffect(getter, () => {
      this._dirty = true;
    })
  }

  get value () {
    if (this._dirty) {
      this._value = this.getter();
      this._dirty = false;
    }
    return this._value;
  }

  set value(newValue) {
    return this.setter(newValue);
  }
}
```

### watch原理

> 底层同样使用了reactive包里的reactiveEffect，getter是第一个处理过的入参，schedule属性会在effect变化后触发。

```js
function watch(source, callback, options) {
  let getter;

  switch (true) {
    case typeof source === 'function':
      getter = source;
      break;
    case source instanceOf Ref:
      getter = () => source.value;
      break;
    // 其他各种判断
  }

  const effect = new ReactiveEffect(getter);
  effect.schedule = callback;
}
```

### vue2和vue3的区别

- vue2是申明式写法
- vue2的watch仅支持监听单个
- vue2的对象属性的删除和新增（比如push、pop等），无法watch到

## props和data

props对于子组件是只读的，完全无法修改（vue3）

```js
class BaseReactiveHandler {
  get(obj, key) {
    return Reflect.get(obj, key);
  }
}

class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor() {
    super();
  }
  set(obj, key) {
    console.warn(`${key} is read only`, obj);
    return true;
  }
}

class MutationReactiveHandler extends BaseReactiveHandler {
  constructor() {
    super();
  }
  set(obj, key, value, receiver) {
    const result = Reflect.set(obj, key, value, receiver);
    return result;
  }
}

const propHandler = new ReadonlyReactiveHandler();
const dataHandler = new MutationReactiveHandler();
const prop = new Proxy({}, propHandler);
const data = new Proxy({}, dataHandler);

data.a = 1;
console.log(data.a);

prop.a = 1;
console.log(prop.a);
```

## diff算法

> vue3专注于降低需要diff的节点数量，更少更精准的dom操作

### 1. 静态提升

静态内容提升到渲染函数外部，避免不必要的diff

```js
// 编译前模板
<div>
  <h1>静态标题</h1>
  <p>{{ dynamicContent }}</p>
</div>

// 编译后代码
const _hoisted_1 = /*#__PURE__*/_createVNode("h1", null, "静态标题", -1 /* HOISTED */)

function render() {
  return (_openBlock(), _createBlock("div", null, [
    _hoisted_1,
    _createVNode("p", null, _toDisplayString(_ctx.dynamicContent), 1 /* TEXT */)
  ]))
}
```

### 2. Patch flag

为每个动态vnode分配patch flag，更新时只要检查有标记的vnode即可

1 - 文本内容变化
2 - class变化
4 - style变化
8 - props变化
16 - 要全量比较

### 3. 最长递增子序列

- 相比vue2，采用首尾匹配 + 最长递增子序列的组合
- 首尾匹配，仍然处理四种常见场景[参考](./vue2.md#diff算法)
- 最长递增子序列处理乱序场景，时间复杂度提高到O(nlogn)，但是最小化dom移动
- 原理：在newElem里寻找新增的元素，他们顺序是固定的；oldElem只和不在列表里的元素对比

### 4. 支持多根节点

避免无意义的外层包裹元素

#### 如何实现？

新增fragment类型vnode，单独处理

```js
function patch(n1, n2, container) {
  if (n2.type === Fragment) {
    if (!n1) {
      // 挂载所有子节点
      n2.children.forEach((el) => patch(null, el, container));
    } else {
      patchChildren(n1, n2, container);
    }
  }
}
```