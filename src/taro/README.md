# taro

## react转小程序思路

### wxml
1. babel 获取 state 和 render 代码
2. 重写 React.createElement 为 html2json
3. 如果 render 里涉及非 state 的属性，要手动 Object.assign 上去
4. 如果是自定义组件，元素名同样转小写，只是需要加到 json 里

### wxss
1. 正常样式，相对路径引用
2. 异常样式，解析scss

### json
1. 需要和wxml结合

### js
无需考虑