# react16+

## 参考
1. 16.3升级指南：https://zcfy.cc/article/update-on-async-rendering
2. ![react16.3](react16.3.png)
2. ![react-native](v2-e00f66e71bd03b9d4c60d056c57be2e3_hd.jpg)
3. 解析过程见 ./src/mobx/react16-*.png
4. vdom见 https://zhuanlan.zhihu.com/p/35876032
5. fiber：https://zhuanlan.zhihu.com/p/37098539
6.  HOC复用和拆分：https://zhuanlan.zhihu.com/p/40245156
7. react-redux：https://segmentfault.com/a/1190000012976767


## lifecycle
  - ```js
  class ExampleComponent extends React.Component {
    // 用于初始化 state
    constructor() {}
    // 用于替换 `componentWillReceiveProps` ，该函数会在初始化和 `update` 时被调用
    // 因为该函数是静态函数，所以取不到 `this`
    // 如果需要对比 `prevProps` 需要单独在 `state` 中维护
    static getDerivedStateFromProps(nextProps, prevState) {}
    // 判断是否需要更新组件，多用于组件性能优化
    shouldComponentUpdate(nextProps, nextState) {}
    // 组件挂载后调用
    // 可以在该函数中进行请求或者订阅
    componentDidMount() {}
    // 用于获得最新的 DOM 数据
    getSnapshotBeforeUpdate() {}
    // 组件即将销毁
    // 可以在此处移除订阅，定时器等等
    componentWillUnmount() {}
    // 组件销毁后调用
    componentDidUnMount() {}
    // 组件更新后调用
    componentDidUpdate() {}
    // 渲染组件函数
    render() {}
    // 以下函数不建议使用
    UNSAFE_componentWillMount() {}
    UNSAFE_componentWillUpdate(nextProps, nextState) {}
    UNSAFE_componentWillReceiveProps(nextProps) {}
  }
  ```

## 更新过程
  - shouldComponentUpdate
  - componentWillUpdate
  - render()
  - componentDidUpdate










