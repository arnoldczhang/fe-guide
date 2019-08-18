# html

## 参考
1. [html所有语义标签](https://blog.csdn.net/microcosmv/article/details/51644998)

## 答疑

### doctype
告知浏览器的解析器用什么文档标准解析这个文档

#### 分类
BackCompat：怪异模式，浏览器使用自己的怪异模式解析渲染页面，默认值
CSS1Compat：标准模式，浏览器使用W3C的标准解析渲染页面
IE8Compat：近乎标准模式

#### 区别

**怪异模式**

- width = 左右border + 左右padding + content宽度
- 内联元素设置width/height有效
- margin: 0 auto无效，用text-align: center替换
- 图片无法设置padding
- overflow: visible自动扩展溢出宽度

**标准模式**

- width = content
  实际宽度 = 左右margin + 左右border + 左右padding + content宽度
- 内联元素设置width/height无效
- margin: 0 auto居中

### src和href

**src**

- 指向外部资源
- 资源会插入文档
- 解析到时会阻塞其他资源的下载和解析
- script、image、iframe

**href**

- 指向网络位置
- 并行下载
- link

**srcset**

- 根据屏幕宽度，动态选用不同尺寸的图片

```html
<!-- 屏幕宽度<=480px时，small-photo.jpg -->
<!-- 屏幕宽度<=1024px时，big-photo.jpg -->
<!-- 屏幕宽度<=1024px，Retina屏时，high-density-photo.jpg -->
<img
  src="low-density-photo.jpg"
  srcset="small-photo.jpg 480w, big-photo.jpg 1024w, high-density-photo.jpg 1024w 2x"
/>
``` 

**类似srcset**

<picture />元素内部包含若干<source />和<img />，针对不同屏幕尺寸提供图片

如果没有满足的<source />，展示<img />

```html
<picture>
    <source srcset="/media/examples/surfer-240-200.jpg"
            media="(min-width: 800px)">
    <img src="/media/examples/painted-hand-298-332.jpg" />
</picture>
```

