## mobx

### 标注解释
  1. @observer：`mixin`部分hooks - `componentWillMount`、`componentWillUnmount`、`componentDidMount`、`componentDidUpdate`到目标组件，
如果组件不存在`shouldComponentUpdate`，则也使用observer的`shouldComponentUpdate`，类似PureComponent效果，浅比较。
  2. @injector：注入selector中的props，基于最外层store。
  3. @autorun：依赖收集，监听触发callback中使用到的key。
  4. @autorunAsync：
  5. @action：
  