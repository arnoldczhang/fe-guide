# 美化的树状结构

## 属性
- data
- option

---

## 数据结构
都可以[参考](./index.d.ts)

---

## 事件

### node-select
```vue
<template>
  <!-- ... -->
  <tree
    :data="data"
    :option="option"
    @node-select="handleNodeSelect" />
  <!-- ... -->
</template>
<script>
export default {
  // ...
  methods: {
    handleNodeSelect(node, index) {
      console.log(node, '当前选中节点的所有信息');
      console.log(index, '当前节点在数组中的索引');
    },
  },
}
</script>
```

---
