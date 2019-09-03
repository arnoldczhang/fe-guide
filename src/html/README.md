# html

## 参考
1. [html所有语义标签](https://blog.csdn.net/microcosmv/article/details/51644998)

## 目录
<details>
<summary>展开更多</summary>

* [`doctype`](#doctype)
* [`src和href`](#src和href)
* [`rel`](#rel)

</details>

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

---

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

---

### rel
>
> 大部分关于`rel`的介绍很久没更新
>
> 权威文档建议直接看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Link_types)
>
> 也有关于[这方面](https://www.zhangxinxu.com/wordpress/2019/06/html-a-link-rel/)的整理
>

#### alternate
>
> 1. 下载优先级变为lowest
>
> 2. 资源仅下载，不做渲染
>
> 3. 如果含`title`属性且有值，则可以控制其渲染or不渲染

**网站换肤**

```html
<link rel="stylesheet" type="text/css" title="默认皮肤" href="test.css">
<link rel="alternate stylesheet" type="text/css" title="皮肤2" href="test1.css">
<link rel="alternate stylesheet" type="text/css" title="皮肤3" href="test2.css">

<script>
// 切换到皮肤3
document.querySelectorAll('link[title]').forEach((link) => {
  // 必须先设为true才能触发切换
  link.disabled = true;
  if (link.title !== '皮肤3') {
    link.disabled = false;
  }
});
</script>
```

**定义要替换的页面**

```html
<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.baidu.com/" />
```

#### canonical
>
> 指定某网站为规范网址，一般用来设置pc端
>
> 移动端直接用alternate设置
>

```html
<link rel="canonical" href="www.xx.com" />
```

#### dns-prefetch
>
> 1. 在用户点击链接之前，就进行dns查找
>
> 2. 目前尚为实验属性
>

```html
<link rel="dns-prefetch" href="www.xx.com" />
```

#### import
用于[web-component](https://developer.mozilla.org/en-US/docs/Web/Web_Components/HTML_Imports)

#### noopener
>
> 1. 通过`target="_blank"`打开的子页，可以操作主页的`window.opener.location`
>
> 2. 任意修改location会导致主页跳转到不可控页面
>
> 3. `rel="noopener"`，可以将子页的`window.opener`置 null

**钓鱼攻击**

```html
<!-- 主页 -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <a href="b.html" target="_blank">da</a>
</body>
</html>
```

```html
<!-- b.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <SCRIPT>window.opener.location.href ="http://google.com"</SCRIPT>
</body>
</html>

```

#### norefferrer
>
> 1. `rel=noopener`支持 chrome49 和 opera36，不支持火狐
>
> 2. `norefferrer`可以兼容

```html
<a href="www.baidu.com" target="_blank" rel="noopener norefferrer" >
```

---

