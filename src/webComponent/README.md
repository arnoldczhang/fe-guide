# webComponent

## 参考

- [组件库-shoelace](https://shoelace.style/components/dropdown)
- [组件库-lit](https://lit.dev/docs/getting-started/)

## 组件库
- [shoelace](https://shoelace.style/getting-started/installation)

- [微软-fast](https://fast.design/docs/)
- [mdn官方示例](https://github.com/mdn/web-components-examples)

## 组成部分

### Custom elements

> 允许自定义元素标签及其自定义行为

### Shadow Dom

> 允许封装“影子”dom树，挂到到元素下，这样能保证元素功能私有，样式也不会和其他地方冲突

### HTML templates

> 可以使用<template />和<slot />编写不显示在页面中的标记模板，而且做到了可复用

### 外部覆盖内部样式

[::part](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::part#)

```html
<template id="tabbed-custom-element">
  <style type="text/css">
    *,
    ::before,
    ::after {
      box-sizing: border-box;
      padding: 1rem;
    }
    :host {
      display: flex;
    }
  </style>
  <div part="tab active">Tab 1</div>
  <div part="tab">Tab 2</div>
  <div part="tab">Tab 3</div>
</template>

<tabbed-custom-element></tabbed-custom-element>
```

```css
tabbed-custom-element::part(tab) {
  color: #0c0dcc;
  border-bottom: transparent solid 2px;
}

tabbed-custom-element::part(tab):hover {
  background-color: #0c0d19;
  border-color: #0c0d33;
}
```

