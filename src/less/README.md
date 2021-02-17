# less

## node使用
详见[postcss原理](../postcss/postcss.js)

## 一些用法

### css变量替换

```less
:root {
  --deep-color: #252626;
}

# 外部用这个变量
@text-deep-color:var(--deep-color);
```



## 坑
[calc计算错误](https://blog.csdn.net/u011628981/article/details/80521602)
