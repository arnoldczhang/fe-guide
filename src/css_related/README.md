# css

## 参考
  - 现代css性能优化：http://verymuch.site/2018/07/22/CSS%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E7%9A%848%E4%B8%AA%E6%8A%80%E5%B7%A7/?nsukey=3eczM2FJ0JQ8aS2hEDt1CnIzmS32kXvEkjuE7I0lrEF7M8jW7k7PPZtuVxX%2BT%2FsRQqGQ7YhSV%2FicPVi%2FrRG%2BhGGQQn6y7EuHKuERI93Idzq2ziur8T8dZL3qgDT%2Bw5au3cocxOGnSC7pBI7bve9tigiinrZL8Xaac042IW%2FR%2FxqJp8Fk21Nm7YbVUczUdhD%2F
  - 5个新css属性：https://zhuanlan.zhihu.com/p/40736286
  - flex：https://mp.weixin.qq.com/s/WtGzVMzh1RupixD_4474mg
  - 23中垂直方法：https://mp.weixin.qq.com/s/JL-9juZgbpz_Cnp6FnLVAQ
  - CSSOM：https://mp.weixin.qq.com/s/xST3cjumPrxdHbcZcYlLvQ


## 属性

### 伪元素 伪类
- https://segmentfault.com/a/1190000000484493

### object-fit（img裁剪）
- cover
- contain

### 平滑滚动
html {
  scroll-behavior: smooth;
}

### width: auto
width: max-content/min-content


## 选择器
  - 保持简单，不要使用嵌套过多过于复杂的选择器
  - 通配符和属性选择器效率最低，需要匹配的元素最多，尽量避免使用
  - 不要使用类选择器和ID选择器修饰元素标签，如h3#markdown-content，这样多此一举，还会降低效率
  - 不要为了追求速度而放弃可读性与可维护性


## CSSOM
  - js运算安全操作css属性
  - chrome66，chromium70+支持

## 答疑

### 为什么CSS选择器是从右向左匹配
  - CSS中更多的选择器是不会匹配的，所以在考虑性能问题时，需要考虑的是如何在选择器不匹配时提升效率。从右向左匹配就是为了达成这一目的的，通过这一策略能够使得CSS选择器在不匹配的时候效率更高。这样想来，在匹配时多耗费一些性能也能够想的通了。

### 屏幕完整截图
  - chrome，command + shift + p



