# emoji -> 单色icon

## 参考
  - [openemoji](https://openmoji.org/)
  - https://zhuanlan.zhihu.com/p/38767488


## 纯色icon

### text-shadow
```html
<ul>
    <li><span class=icon>🚲</span>   Bicycles</li>
    <li><span class=icon>✈️</span>   Planes</li>
    <li><span class=icon>🚂</span>   Trains</li>
</ul>
```
```css
.icon {
  color: transparent;
  text-shadow: 0 0 #ec2930;
}
```

### background-clip
```css
.icon {
  color: transparent;
  background-color: #ec2930;
  background-clip: text;
  -webkit-background-clip: text;
}
```

## 渐变icon
```css
.icon {
  background-image: linear-gradient(45deg, blue, red);
}
```

## 异形字选择符
  - ![ufe00](UFE00.pdf)

## es6表示法
```js
console.log('\u{1f6b2}') // 🚲
console.log('\u{1f682}') // 🚂
console.log('\u{1f4e5}') // 📥
console.log('\u{1f4e4}') // 📤
console.log('\u{1f4c1}') // 📁
```





