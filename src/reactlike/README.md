# reactlike-anujs

## 待废弃生命周期
  - componentWillReceiveProps
  - componentWillUpdate
  - componentWillMount

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
      - tag：1-function，2-class，5-node，6-text
      - 根据ref类型处理、赋值；绑定_owner
  - ### render/hydrate
    - #### 解析
      - createContainer
      - createInstance
      - emptyElement
      - updateComponent
  - ### createContainer
    - #### 解析
      - container转fiber
  - ### createInstance
    - #### 解析
      - 实例化fiber，触发render
      - 更新updateQueue，包含pendingStates和pendingCbs
  - ### emptyElement
    - #### 解析
      - 清空childNodes
  - ### updateComponent
    - #### 解析
      - pushChildQueue
      - mergeUpdates
      - Renderer.scheduleWork
  - ### pushChildQueue
    - #### 解析
      - fiber队列去重，录入
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
      - reconcileDFS
      - updateCommitQueue
      - resetStack
      - 遍历macrotasks，执行workLoop，直至macrotasks被清空，commitDFS
      - commitDFS
  - ### reconcileDFS
    - #### 解析
      - 遍历fiber.siblings
      - updateClassComponent（tag < 3）
      - updateHostComponent（tag >= 3）
  - ### commitDFS
    - #### 解析
      - commitDFSImpl
  - ### updateClassComponent
    - #### 解析
      - 更新componentWillReceiveProps/shouldComponentUpdate/componentWillUpdate
      或挂载componentWillMount当前fiber
      - getChildContext准备子fiber的context
      - applybeforeUpdateHooks
      - applybeforeMountHooks
  - ### updateHostComponent
    - #### 解析
      - getInsertPoint（!parent.insertPoint）
      - diffChildren（tag === 5）
  - ### applybeforeMountHooks
    - #### 解析
      - 触发componentWillMount或setStateByProps
      - mergeStates
      - 更新updateQueue
  - ### applybeforeUpdateHooks
    - #### 解析
      - 检测props、context、state变更触发componentWillReceiveProps
      - mergeStates
      - setStateByProps
      - 根据props、state和shouldComponentUpdate检测属性变更，如果有，触发componentWillUpdate
  - ### setStateByProps
    - #### 解析
      - 根据nextProps更新memoizedState
  - ### mergeStates
    - #### 解析
      - 根据updateQueue.length，判断是直接返回memoizedState或state，还是遍历updateQueue，
      更新nextState，赋值memoizedState并返回
  - ### getInsertPoint
    - #### 解析
      - 返回子fiber中的普通节点（tag > 3）
















