## 区别：
  1. redux单一store，mobx多个store
  2. redux的store是普通对象，mobx的store是observable
  3. redux的state只读，每次update是基于原state产生新的state，
      mobx的更改都基于state
  4. redux的state由于是新对象，会有重复渲染问题，特别是深层嵌套问题更大，需要+pure component优化，
      mobx的@observer，自带pure component功能


## 优劣：
  1. 可调试性：
    - redux是state -> view -> action -> reducer闭环结构，便于调试
    - mobx随处可触发，难以追踪
  2. 代码灵活性：
    - redux源码少，业务多，可以引入中间件统一处理
    - mobx源码多，业务少，没有中间件
  3. 模块化：
    - redux单一数据源
    - mobx分散store
  4. 可扩展、可维护性：
    - redux集中处理，state更新顺序可预测
    - mobx无法保证更新顺序
  5. typescript：
    - redux不支持
    - mobx支持
  6. 性能
    - mobx可以精确定位到propsChange涉及到的Component
    - redux需要从Provider逐层判断

