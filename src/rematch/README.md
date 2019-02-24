# redux + rematch

## 参考
- [Vuex、Flux、Redux、Redux-saga、Dva、MobX](https://zhuanlan.zhihu.com/p/53599723)

## steps
  1. init
  2. initStore
  3. createStore
  4. dispatch

## 模式
  - 发布订阅
    1. connect初始化的时候，subscribe相应listener，listener是connect的onStateChange
    2. dispatch action的时候会触发listener队列的检查，发现hasPropsChanged的时候，this.setState({})，触发内部渲染
    3. rematch自动生成action -》reducer关系