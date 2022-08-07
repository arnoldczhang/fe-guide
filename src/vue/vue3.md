# vue3

## 参考

- [react16、vue2、vue3 diff算法对比](https://juejin.cn/post/7116141318853623839)



## 目录

<details>
<summary>展开更多</summary>


* [`组件二次封装`](#组件二次封装)

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

