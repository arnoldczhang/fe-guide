# react16+

## 参考
- [16.3升级指南](https://zcfy.cc/article/update-on-async-rendering)
- 解析过程见 ./src/mobx/react16-*.png
- vdom见 https://zhuanlan.zhihu.com/p/35876032
- [fiber](https://zhuanlan.zhihu.com/p/37098539)
- [ HOC复用和拆分](https://zhuanlan.zhihu.com/p/40245156)
- [react-redux](https://segmentfault.com/a/1190000012976767)
- [react17](https://zhuanlan.zhihu.com/p/46147401)
- [redux大型项目](https://zhuanlan.zhihu.com/p/47396514)
- [react16新特性](https://zhuanlan.zhihu.com/p/52016989?utm_source=75weekly&utm_medium=75weekly)
- [Dan对react内部的解释](https://overreacted.io/)
- [react-christmas](https://react.christmas)
- [Vuex、Flux、Redux、Redux-saga、Dva、MobX](https://zhuanlan.zhihu.com/p/53599723)
- [ReactFiber在并发模式下的运行机制](https://zhuanlan.zhihu.com/p/54042084)
- [TypeScript 2.8下的终极React组件模式](https://juejin.im/post/5b07caf16fb9a07aa83f2977)
- [create-react-app in docker](https://mherman.org/blog/dockerizing-a-react-app/)

## 目录
<details>
<summary>展开更多</summary>

* [`相关库`](#相关库)
* [`lifecycle`](#lifecycle)
* [`更新过程`](#更新过程)
* [`react16之前`](#react16之前)
* [`react16`](#react16)
* [`redux大型项目构建`](#redux大型项目构建)
* [`React Hooks流程`](#ReactHooks流程)
* [`React进阶`](#React进阶)
* [`concurrent`](#concurrent)
* [`contextAPI`](#contextAPI)
* [`rn`](#rn)
* [`interview`](#interview)

</details>

## 相关库
1. ckeditor： https://ckeditor.com/blog/best-wysiwyg-editor-for-angular-react/
2. react可视化库：https://mp.weixin.qq.com/s/NgaQ4sGI4RDXb23ua2Spbw

## lifecycle
![react16.3](react16.3.png)
```js
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

---

## 更新过程
- shouldComponentUpdate
- componentWillUpdate
- render
- componentDidUpdate

---

## react16之前
- 自顶向下递归解析，生成虚拟节点
- 通过diff算法，生成变更patch
- patch放到更新队列
- 无法中断，直到整棵虚拟节点树解析完成，将线程交给渲染引擎

### diff策略
1. 针对input、option、select、textarea做了特殊处理
2. 针对dom属性做处理
  * style
  * 其他属性
3. 针对dom&dom子节点做处理
  * text不同 => updateTextContent
  * key、type不同 => 节点增、删、改

---

## react16
[requestIdleCallback](../js&browser/requestIdleCallback.md)

### fiber
- 虚拟的堆栈帧
- 存在优先级
- 时间分片

#### 结构
- return: 父节点
- sibling: 下一个兄弟节点
- child: 子节点
- alternate: current-tree <==> workInProgress-tree对应的fiber

### first-render

**调用过程**

![first render](../mobx/react16-init.png)

**动画演示**

图中垂直方向是sibling的关系

![fiber遍历过程](./fiber遍历过程（动画）.gif)

1. render阶段
  * React.createElement创建element-tree
  * 每个element绑定fiber，记录上下文信息
  * fiber-tree => current-tree
  * setState会重建element，更新fiber的必要属性
2. schedule阶段
  * schedule work
    + 根据fiber找其根节点root（找不到则会根据fiber类型，出warnUnmounted）
    + 查找过程更新每个fiber的expirationTime
  * request work
    + 将root-fiber提上schedule
  * perform work
    + 构造workInProgress-tree
    + current指向新的fiber
  * begin work
    + 返回指向要在循环中处理的下一个子节点的指针或 null
3. reconcile阶段
  * reconcilation
    + 遍历fibers，diff出effectlist（各种变更信息）给commit阶段
  * commit
    + commitRoot根据effect的effectTag，分别做增、删、改等操作
    + 最终将结果反映到真实dom

### diff策略
reconcileChildFibers

#### 简易流程
- 首次渲染创建current树
- 处理变更时，创建workInProgress树
- 所有操作在workInProgress树进行
- 操作完，将workInProgress树变更反应到页面上
- workInProgess树替换current树

#### 判断fiber类型
- text节点
- 单个element
- element数组

#### text节点
- 如果第一个节点是text节点
  * 删除剩余sibling节点
  * 复用第一个节点
- 如果第一个节点不是text节点
  * 删除当前及其sibiling节点
  * 创建text节点

注：删除只是打上tag=delete，真正在commit时删除

#### 单个element节点
- props
- 如果key、type相同
  * 删除老fiber的siblings
  * 复用老fiber
- 如果key、type不同
  * 在当前fiber及siblings里找key相同的，复用
  * 找不到的话，删除当前fiber，创建新fiber
- 如果key相同、type不同
  * 复用老fiber，删除siblings

#### element数组
- 遍历
- 如果newChild是text节点
  * 老fiber有key的话（说明是element），不能复用，返回null
  * 老fiber没有key的话，复用
- 如果newChild是element节点
  * 根据key、type判断是否可复用

#### 整个流程
1. 新老fiber的index对比，用updateSlot找可复用的fiber（kty、type）
2. 老fiber数和新fiber数对比，老<新，新fiber插入，否则老fiber批量删除
3. 老fiber按key、index存到map，遍历新数组，做老元素移动/插入处理

### 对比差异
- react16将渲染阶段分为三段（render，diff，commit）
- fiber是链表形式
- 每个fiber有expirationTime、优先级（用于在commit阶段做时间分片渲染）

**注：一开始用的 Priority，后来改为 expirationTime， 之后又改为递减的 expirationTime**

### 一些问题

#### 虚拟节点和fiber区别
- 虚拟节点描述的还是node
- fiber是虚拟节点的抽象表示，类似一个工作单元，便于中断挂起

#### 拆分维度
按虚拟节点element拆

#### 如何调度
- 工作循环
- fiber优先级

每次工作单元处理完，判断当前帧是否有空余时间，
没有的话，用requestIdleCallback回调执行

#### 中断/断点恢复
- fiber保存当前进度（firstEffect、lastEffect）
- 修改effectTag（Update、Snapshot、Deletion、Placement）

---

## redux大型项目构建

### 使用索引（index）存储数据，使用选择器（selector）访问数据

#### 使用索引（index）存储数据
```js
// 接口返回
/*
{
  userList: [
    {
      id: 123,
      name: abc,
      // ...
    },
    // ...
  ],
}
*/

// 前端存储（转换成散列表索引）
/*
{
  userList: {
    123: {
      id: 123,
      name: abc,
      // ...
    },
    // ...
  },
}
 */
```

#### 使用选择器（selector）访问数据
```js
const getUserList = ({ userMap }) => (
  Object.keys(userMap).map(key => userMap[key])
);

const getSelectedUserList = ({ selectedIdList, userMap }) => (
  selectedIdList.map(id => userMap[id])
);
```

### 状态隔离
```js
// 只有view状态
/*
{
  userList: {
    123: {
      id: 123,
      name: abc,
      // ...
    },
    // ...
  },
}
*/

// 新增edit状态
/*
{
  userList: {
    123: {
      id: 123,
      name: abc,
      // ...
    },
    // ...
  },
  editingUserList: {
    123: {
      id: 123,
      name: abc,
      // ...
    },
    // ...
  },
}

 */
```

### 重用reducer

#### 作用域（scope）或者前缀（prefix）对动作类型（types）进行特殊处理
```js
const initialPaginationState = {
  startElement: 0,
  pageSize: 100,
  count: 0,
};

const paginationReducerFor = (prefix) => {
  const paginationReducer = (state = initialPaginationState, action) => {
    const { type, payload } = action;
    switch (type) {
      case prefix + types.SET_PAGINATION:
        const {
          startElement,
          pageSize,
          count,
        } = payload;
        return Object.assign({}, state, {
          startElement,
          pageSize,
          count,
        });
      default:
        return state;
    }
  };
  return paginationReducer;
};

// 加前缀
const usersReducer = combineReducers({
  usersData: usersDataReducer,
  paginationData: paginationReducerFor('USERS_'),
});

const domainsReducer = combineReducers({
  domainsData: domainsDataReducer,
  paginationData: paginationReducerFor('DOMAINS_'),
});
```

---

## ReactHooks流程
![react hooks](react-hook.jpg)

---

## React进阶
[参考](https://juejin.im/post/5c92f499f265da612647b754?utm_source=gold_browser_extension)

### Fiber

**更新流程**

- reconciliation
  * 更新state/prop
  * life hooks
  * 生成fiber tree
  * diff
- render
  * Fiber节点打上 effectTag
  * effectTag 代表了 Fiber 节点做了怎样的变更
  * 具有 effectTag 的 Fiber 会成为 effect
  * 随completeUnitOfWork过程向上收集
- commit
  * 节点更新（若需）

**结构**

```js
class Fiber {
  constructor() {
    this.instance = instance;
    this.return = parent;
    this.child = child;
    this.siblings = firstBrotherNode;
  }
}
```

**链表树遍历算法**

- 深度遍历child，到树末尾
- siblings
- 返回return节点，重复siblings
- 直至root

![Fiber遍历图](./Fiber遍历图.jpg)
![Fiber遍历动画图](./fiber遍历过程（动画）.gif)

**伪代码**

```js
while (当前还有空闲时间 && 下一个节点不为空) {
  下一个节点 = 子节点 = beginWork(当前节点);
  if (子节点为空) {
    下一个节点 = 兄弟节点 = completeUnitOfWork(当前节点);
  }
  当前节点 = 下一个节点;
}
```

**解决进程阻塞**

- 任务分割
- 异步调用
- 缓存策略


### 生命周期

---

## concurrent
未来版本react会推出concurrent模式，与当前版本sync区别可[参考](https://zhuanlan.zhihu.com/p/60307571)


### 差异图
[sync VS concurrent](./syncVSconcurrent.jpg)

### 任务优先级
* expiration time
  - fiber设置过期时间，防止低优任务被高优任务耽误，导致一直不执行
  - 高低优任务对应的expiration time有改动，不绝对
* Sync > InteractiveExpiration（事件中触发比如blur、click） > AsyncExpiration

---

## contextAPI
[Unstated Next](https://github.com/jamiebuilds/unstated-next)

封装react的contextAPI，模拟状态管理

---

## rn
![react-native](v2-e00f66e71bd03b9d4c60d056c57be2e3_hd.jpg)

---

## interview
[react的304道题](https://github.com/semlinker/reactjs-interview-questions)


