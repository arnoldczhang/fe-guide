# css-modules

## 示例

**编译前**

```vue
<style module> 
.guang {
    color: red; 
} 
</style>  
<template>
    <p :class="$style.guang">hi</p>  
</template>
```

**编译后**

```vue
<style module>
._1yZGjg0pYkMbaHPr4wT6P__1 { 
    color: red; 
} 
</style> 
<template> 
    <p class="_1yZGjg0pYkMbaHPr4wT6P__1">hi</p> 
</template>
```

