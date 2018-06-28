# reactlike-anujs

## 功能函数
  - ### createElement
    - #### 入参
      - type, config, children
    - #### 解析
      1. 过滤有效（非保留字段、非继承字段）props
      2. defaultProps（props对应字段，值为void 0时）赋值
      3. 处理children，结果为数组或child对象（单个子节点时）
      4. next -> ReactElement
  - ### ReactElement
    - #### 入参
      - type, tag, props, key, ref, owner
    - #### 解析
      - 根据ref类型处理、赋值；绑定_owner
  - ### render/hydrate
    - #### 解析
      - createContainer
      - createInstance
      - emptyContainer
      - updateComponent
  - ### createContainer
    - #### 解析
      - container转fiber
  - ### createInstance
    - #### 解析
      - 实例化fiber，触发render
  - ### updateComponent
    - #### 解析
      - pushChildQueue
      - mergeUpdates
      - Renderer.scheduleWork
  - ### pushChildQueue
    - #### 解析
      - fiber去重，录入
  - ### mergeUpdates
    - #### 解析
      - push需要更新的state，push触发首次render之后的回调
  - ### Renderer.scheduleWork
    - #### 解析
      - performWork
  - ### performWork
    - #### 解析
      - workLoop
      - 清空microtasks，非卸载节点的操作都转换成macrotasks
      - 若存在macrotasks，则在requestIdleCallback（帧空闲）继续执行performWork
  - ### workLoop
    - #### 解析
      - 
      - reconcileDFS
      - updateCommitQueue
      - resetStack
  - ### reconcileDFS
  - ### commitDFS
  - ### commitDFSImpl
  - ### updateClassComponent
    - #### 解析
      - 更新componentWillReceiveProps/shouldComponentUpdate/componentWillUpdate
      或挂载componentWillMount当前fiber
      - getChildContext准备子fiber的context
  - ### applybeforeUpdateHooks
    - #### 解析
      - 检测props、context、state变更触发componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate