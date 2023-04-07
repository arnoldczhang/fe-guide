# vue3

## 参考

- [react16、vue2、vue3 diff算法对比](https://juejin.cn/post/7116141318853623839)



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

>新增`defineOptions`，可在setup里定义组件基本信息（不用单独搞个<script>定义组件name了）

[参考](https://www.npmjs.com/package/unplugin-vue-define-options)