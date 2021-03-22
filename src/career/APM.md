# APM

## 目录

<details>
<summary>展开更多</summary>

* [`背景`](#背景)
* [`业务现状`](#业务现状)
* [`解决价值`](#解决价值)
* [`监控流程`](#监控流程)
* [`整体流程`](#整体流程)
* [`埋点事件`](#埋点事件)
* [`埋点管理`](#埋点管理)
* [`性能指标`](#性能指标)
* [`性能优化方案`](#性能优化)
* [`业界产品`](#业界产品)
* [`常见设计`](#常见设计)
* [`设计思考`](#设计思考)

</details>

## 背景

> 应用性能管理（Application Performance Management）是一个比较新的网络管理方向，
>
> 主要指对企业的关键业务应用进行监测、优化，提高企业应用的可靠性和质量，保证用户得到良好的服务，降低 IT 总拥有成本(TCO)。
>
> 使用全业务链的敏捷 APM 监控，可使一个企业的关键业务应用的性能更强大，可以提高竞争力，并取得商业成功，
>
> 因此，加强应用性能管理（APM）可以产生巨大商业利益。

---

## 业务现状

---

## 解决价值

---

## 监控流程

| 事前 | 事中 | 事后 |
| - | -: | :-: |
| 设置预警 | 触发预警 | 完善预警 |
| 配置埋点 | 人工干预 | 完善埋点 |
|   |   | casestudy |

---

## 整体流程

![整体流程](http://assets.processon.com/chart_image/5dbaa54de4b0335f1e484262.png?_=1572513123554)

### 业务整理

### 采集上报

### 加工存储

### 消费应用

---

## 埋点事件

### 业务埋点

#### 事件分类

![分类](http://assets.processon.com/chart_image/5dba85d9e4b0ea86c41bbe0f.png?_=1572512990929)

#### 事件解释

| 类型 | 名称 | 解释 | 调用方式 |
| - | -: | -: | :-: |
| AS | 应用启动 | 启动并加载第一个页面，或者从后台切回 | 静默 |
| AD | 应用退出 | 应用切换到退出后台，应用被 Kill | 静默 |
| PV | 页面展现 | 页面/单页组件加载 | 静默 |
| PD | 页面关闭 | 页面/单页组件卸载 | 静默 |
| MV | 模块展示 | 模块首次展示 | 手动 |
| MC | 模块点击 | 模块首次点击 | 手动 |
| ORDER | 下单 | 下单按钮每次点击 | 手动 |
| PAY | 支付 | 支付按钮每次点击 | 手动 |
| custom | 自定义埋点 | 其他类型事件 | 手动 |

#### 代码示例

**APP**

```js
// 微信小程序
// 支付宝小程序
const WrapperApp = (params = {}) => {
  const { onLaunch, onHide } = params;
  if (typeof onLaunch === 'function') {
    params.onLaunch = function(options) {
      onLaunch.call(params, options);
      console.log('as');
    };
  } else {
    params.onLaunch = function(options) {
      console.log('as');
    };
  }

  if (typeof onHide === 'function') {
    params.onHide = function() {
      onHide.call(params);
      console.log('ad');
    };
  } else {
    params.onHide = function() {
      console.log('ad');
    };
  }
  return App(params);
};

// ...
WrapperApp({
  onLaunch(options) {
    console.log('as');
  },
  onHide() {
    console.log('ad');
  },
})
```

**PAGE**

```js
// 微信小程序
// 支付宝小程序
const WrapperPage = (params = {}) => {
  const { onLoad, onUnload } = params;
  if (typeof onLoad === 'function') {
    params.onLoad = function(options) {
      onLoad.call(params, options);
      console.log('pv');
    };
  } else {
    params.onLoad = function(options) {
      console.log('pv');
    };
  }

  if (typeof onUnload === 'function') {
    params.onUnload = function() {
      onUnload.call(params);
      console.log('pd');
    };
  } else {
    params.onUnload = function() {
      console.log('pd');
    };
  }
  return App(params);
};

// ...
WrapperPage({
  onLoad(options) {
    console.log('pv');
  },
  onUnload() {
    console.log('pd');
  },
})
```

### 性能埋点

#### 事件解释

| 类型 | 名称 | 解释 | 调用方式 |
| - | -: | -: | :-: |
| FP | 首次绘制 |   | 静默 |
| FCP | 首次内容绘制 |   | 静默 |
| FMP | 意义值最大的布局变动之后的那个绘制 | 主角元素呈现在屏幕上的时刻 | 静默 |
| TTI | 可交互时间 | 页面处于 idle 的时间 | 静默 |
| FPS | 画面每秒传输帧数 |   | 静默 |

### 异常埋点

#### onerror

```js
// h5
window.addEventListener('error', (...args) => {
  console.log(args);
});

// 微信小程序
// 支付宝小程序
const WrapperApp = (params = {}) => {
  const { onError } = params;
  if (typeof onError === 'function') {
    params.onError = function(msg) {
      onError.call(params, msg);
      console.log(msg);
    };
  } else {
    params.onError = function(msg) {
      console.log(msg);
    };
  }
  return App(params);
};

// ...
WrapperApp({
  onError(msg) {
    console.log(msg);
  },
});
```

#### unhandledrejection

```js
// h5
window.addEventListener("unhandledrejection", function(e){
  e.preventDefault();
  console.log(e);
});
```

#### reject

```js
Promise.reject = function reject(output) {
  const oldReject = Promise.reject;
  try {
    oldReject(output);
  } catch(err) {
    // TODO 上报触发reject时的事件
  }
};
```

#### addEventListener

```js
// h5
const originAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
  const addStack = new Error(`Event (${type})`).stack;
  const wrappedListener = (...args) => {
    try {
      // 监听listener的异常
      return listener.apply(this, args);
    } catch(err) {
      // 手动扩展堆栈
      err.stack += '\n' + addStack;
      // throw的error是同域的，可被window.onerror捕获
      throw err;
    }
  };
  return originAddEventListener.call(this, type, wrappedListener, options);
}
```

#### custom

```js
try {
  // ...
} catch(err) {
 throw err;
}
```

---

## 性能指标

- [阿里云-arms](https://help.aliyun.com/document_detail/60288.html?spm=a2c4g.11186623.6.564.Kdg2bo#%E8%AE%BF%E9%97%AE%E9%80%9F%E5%BA%A6)
- [自动化 Web 性能优化分析方案](https://mp.weixin.qq.com/s/2CHA5ewWz_SIlBrdEuVv7w)
- [微信小程序评分细则](https://developers.weixin.qq.com/miniprogram/dev/framework/audits/scoring.html)
- [新一代性能指标](https://juejin.im/post/5ecc5521e51d45788e17dcc6)

### 评分细则

![页面评分细则](./页面评分细则.jpeg)

### 健康度

![页面健康度](./页面健康度.png)

### 页面满意度

> 注：T = 2 秒

性能指数 APDEX（全称 Application Performance Index）是一个国际通用的应用性能计算标准。该标准将用户对应用的体感定义为三个等级：

- 满意（0 ~ T）
- 可容忍（T ~ 4T）
- 不满意（大于 4T）

### 关键性能指标

> google 提供了一个 [web-vitals](https://www.npmjs.com/package/web-vitals)，可以快速测定部分性能指标

**首包时间**

responseStart - domainLookupStart

**首次渲染**

responseEnd - fetchStart

从请求开始到浏览器开始解析第一批 HTML 文档字节的时间差

**First Input Delay (FID)**

衡量可交互性，为了提供良好的用户体验，页面的 `FID` 应当小于 100 毫秒

**Largest Contentful Paint (LCP)**

`LCP` 应该在页面首次开始加载后的 2.5 秒内发生

**Cumulative Layout Shift (CLS)**

衡量视觉稳定性，为了提供良好的用户体验，页面的 `CLS` 应保持小于 0.1

**首次可交互**

domInteractive - fetchStart

浏览器完成所有 HTML 解析并且完成 DOM 构建，此时浏览器开始加载资源

**DOM Ready**

domContentLoadEventEnd - fetchStart

如果页面有同步执行的 JS，则同步 JS 执行时间 = ready - tti

**页面完全加载**

loadEventStart - fetchStart

= 首次渲染时间 + DOM 解析耗时 + 同步 JS 执行 + 资源加载耗时

### 区段耗时

- DNS 查询
- TCP 连接
- 请求响应
- 内容传输
- DOM 解析
- 资源加载

**DNS 查询**

domainLookupEnd - domainLookupStart

**TCP 连接**

connectEnd - connectStart

**SSL 安全连接耗时**

connectEnd - secureConnectionStart

**Time to First Byte（TTFB）**

网络请求耗时

responseStart - requestStart

**数据传输耗时**

responseEnd - responseStart

**DOM 解析**

domInteractive - responseEnd

**资源加载**

loadEventStart - domContentLoadedEventEnd

### dom 层

- dom 数
- dom 最大层级

### 静态资源

- 资源压缩
- 开启 gzip
- 图片优化（cdn、懒加载、webp、识别大体积图）
- 资源缓存

---

## 性能优化

- [京喜小程序优化指南](https://segmentfault.com/a/1190000022164644)

---

## 常见设计

> 参考[阿里云监控](https://arms.console.aliyun.com/retcode)

**总分类**

- 总览
- 页面性能
- 异常
- api 请求
- 访问明细

### 总览

- pv/uv
- js 错误
  * 错误数
  * 错误率
  * 错误数周同比
  * 错误率周同比
  * 环比新增错误种类
- 首屏渲染耗时/周同比
- api 错误
  * 错误数
  * 错误率
  * 错误数周同比
  * 错误率周同比
  * 环比新增错误种类
- 资源错误
  * 错误数
  * 错误数周同比
  * 环比新增错误种类
- js 错误趋势（x: 时间，y: 数量、率）
  * 错误数
  * 错误率
- api 请求趋势（x: 时间，y: 数量、率）
  * 错误数
  * 成功数
  * 成功率
- 首次渲染耗时趋势
  * x: 时间
  * y: 耗时
- 资源错误趋势
  * link 错误
  * script 错误
  * img 错误
  * object 错误
- 分布
  * [地理](#地理)

### 页面性能

- 满意度
- 访问速度

#### 满意度

[参考](#页面满意度)

- 满意度趋势
  * x: 时间
  * y: 满意度指数/样本数
- 分布
  * [地理](#地理)
  * [终端](#终端)

#### 访问速度

- 加载详情

* [关键性能](#关键性能指标)
* [区段耗时](#区段耗时)

- 瀑布图
- 性能（时间）分布
  * x: 时间
  * y: 耗时
- 慢会话
- 分布
  * [地理](#地理)
  * [终端](#终端)
  * [网络](#网络)
  * [版本](#版本)

### 异常

- js 异常
- 资源异常

#### js 异常

- 数量、率、影响用户
- 趋势
  * x: 时间
  * y: 数量
- 页面错误率排行
- 错误数量排行
- 分布
  * 浏览器
  * 操作系统
  * 设备
  * 版本
  * [地理](#地理)

#### 资源异常

- link 错误: <link>标签中引入的 CSS 文件加载错误
- script 错误: <script>标签中引入的 JS 文件加载错误
- img 错误: <img>标签中引入的图片文件加载错误
- object 错误: <object>标签中引入的对象加载错误

### api 请求

- api 总览
- api 详情

#### api 总览

- 成功率趋势
  * x: 时间
  * y: 率
- 分布
  * [地理](#地理)
  * [终端](#终端)
  * [版本](#版本)
- 链路追踪
  * 成功排行
  * 失败排行

#### api 详情

- 可选趋势（x: 时间，y: 率）
  * 成功率
  * 成功耗时
  * 失败耗时
  * 缓慢次数
  * 错误次数
- api 调用列表

### 访问明细

- 全部日志
- js 错误日志
- api 日志
- 页面性能相关日志
- pv 日志

### 维度

- 页面
- 地理
- 终端
- 网络
- 版本

#### 页面

- pv/uv
- js 错误率趋势
  * x: 时间
  * y: 率
- js 错误聚类（错误信息、错误数、影响用户数）
- api 详情
- api 链路追踪

#### 地理

- 中国
- 世界

#### 终端

- 浏览器
- 操作系统
- 设备
- 分辨率

#### 网络

- 运营商
- 网络制式

---

## 设计思考

> 具体问题具体分析 + 知行合一 + 抓主要矛盾

### js 异常

#### 场景

- 开发阶段
- 上线灰度阶段
- 上线完成回归阶段

#### 侧重点

**开发阶段**

对异常明细更加关注，按页面分类即可轻松定位到问题根源

**上线灰度阶段**

- 对异常趋势（时间点）更加关注，需要清晰标识新增异常最优
- 这个阶段会大量用到辅助维度的筛选（运营商、网络环境、sdk 版本、设备信息等），这样能快速缩小问题导致的根源

**上线完成回归阶段**

- 比较关注第三方变更（接口上线、区域网络、开关变动、底层容器发布新版）
- 这个阶段也会用到辅助维度，不过能标识出关键变更的时间点更重要

![线上变更管控](./生产变更.png)

#### 问题处理流程

> 确保页面的单一职责

- 发现问题
- 定位问题
- 解决问题

**思考**

1. 面向什么样的场景
2. 通过什么方式
3. 提供什么样的解决方式
4. 帮助什么样的用户提供什么价值

#### 异常归类

```js
const errorList = [
  // 读取/写入对象属性失败，请检查对象是否存在
  /Cannot (?:read|set) property/,
  // 读取/写入对象属性失败，请检查对象是否存在
  /Cannot call method [^\s]+ of undefined/,
  // 调用小程序api方法失败，请检查当前基础库版本是否支持
  /not implemented/,
  // 调用对象属性失败，请检查对象是否存在
  /(?:[^\s]+) is not an object/,
  // 调用的变量未声明
  /(?:[^\s]+) is not defined/,
  // 调用的变量未声明
  /Can't find variable:/,
  // 调用的方法未声明
  /(?:[^\s]+) is not a function/,
  // JSON.parse异常，请检查入参是否是对象或对象是否存在
  /Unexpected token [^\s]+ in JSON at position \d+/,
  // JSON.parse异常，请检查入参是否是对象或对象是否存在
  /Unexpected end of JSON input/,
  // 调用的对象方法不存在，执行失败
  /Failed to execute [^\s]+ on /,
  // 调用的对象方法不存在，执行失败
  /Object [\s\S]+ has no method/,
  // 代码执行异常，请检查是否缺少{、}、(、)等符号
  /Unexpected end of input/,
  // 代码执行异常，请检查是否缺少{、}、(、)等符号
  /(?:Uncaught |)SyntaxError/,
  // 跨域脚本抛错，需要添加跨域属性来获取更多异常信息
  /Script error/i,
  // 小程序页面不存在，请检查页面文件
  /page [\s\S]+ not found/i,
  // 小程序页面不存在，请检查页面文件
  /can not find page: [^\s]+ when execute /,
  // 小程序引用的组件不存在，请检查组件注入即组件文件
  /Can not find Component/,
  // 小程序同步api方法未执行回调，请检查入参
  /SYNC [^\s]+ do not execute callback/,
  // 数组越界，请检查数组最大长度
  /Array index out of range/,
  // 爆栈，请检查是否存在死循环
  /maximum call stack size exceeded/i,
  // element-ui内部异常，业务层面难以完全解决
  /ResizeObserver loop limit exceeded/,
  // 小程序底层代码异常
  /Attempt to invoke interface method/,
  // 从安全角度，禁止读取跨域窗口（包括iframe）的内部信息，请检查是否有类似操作
  /(?:Uncaught SecurityError: |)Failed to read the [^\s]+ property from [^\s]+/,
  // 从安全角度，禁止读取跨域窗口（包括iframe）的内部信息，请检查是否有类似操作
  /Uncaught SecurityError: Blocked a frame with origin/,
  // 从安全角度，禁止读取跨域窗口（包括iframe）的内部信息，请检查是否有类似操作
  /Permission denied to access property/,
  // 变量解构出错，请检查变量是否存在，或者是否为可解构类型（Array/Map/Set/String/NodeList/Arguments/TypedArray）
  /Invalid attempt to destructure non-iterable instance/,
  // vue资源文件读取失败，请检查assetsPublicPath是否正确配置
  /Loading [^\s]+ chunk [^\s]+ failed/,
];
```

---

### 网络请求

主要考虑三大方面：

- 网络请求数
- 网络请求失败率
- 网络请求耗时

#### 发现问题

- （单个/普遍）网络请求失败率增长
- （单个/普遍）网络请求量减少
- （单个/普遍）网络请求耗时增加

#### 定位问题

|   | 普遍&突发 | 个别&突发 | 普遍&微幅&趋势增长 |
| :- | :- | :- | :- |
| **网络请求失败率增长** | **内部因素**<br />1. 应用主要接口是否上线<br />2. 接口底层是否有改造上线<br />**外部因素**<br />1. 云服务器连接是否异常<br />**维度分析**<br />1. 运营商<br />2. 网络制式<br />3. 省市<br />4. 操作系统<br />5. 设备<br />6. 浏览器版本 | 分析该接口请求响应值 | **内部因素**<br />1. 前端版本放量<br />2. 接口版本放量<br />**外部因素**<br />1. 基础库灰度放量 |
| **网络请求量减少** | 1. 首页或多个子页面是否异常<br />2. 埋点上报是否异常 | 1. 请求发出的各页面是否存在异常<br />2. 请求发出的各页面入口是否关闭、灰度等 | 同上 |
| **网络请求耗时增加** | **内部因素**<br />1. 应用相关接口是否上线<br />2. 接口底层是否有改造上线<br />**外部因素**<br />1. 云服务器是否连接异常 | 1. 接口是否存在上线灰度等情况 | 同上 |

#### 解决问题

| 问题 | 根因 | 最优解决 |
| - | - | - |
| 运营商 | 运营商问题 | 相应负责人 |
| 网络制式 | 运营商问题 | 同上 |
| 省市 | 运营商问题 | 同上 |
| 操作系统 | 兼容性问题 | 兼容性能力分析库 |
| 设备 | 兼容性问题 | 同上 |
| 浏览器版本 | 兼容性问题 | 同上 |
| 后端接口 | 后端问题 | 相应负责人 |
| 后端中间件 | 后端问题 | 同上 |
| 云服务器 | 后端问题 | 同上 |
| 基础库版本 | 外部问题 | 相应负责人 |
| 灰度阶段 | 业务代码问题 | 停止灰度，回退 |
| 页面 | 业务代码问题 | 同上 |
| 接口返回值 | 需要排查 | 前后端排查 |

### 智能分析

判定出现异常（耗时、总量、失败率）的标准可依次定为：

**耗时**

- 维度耗时 +300ms（预估值，可改）
- 日同比 +20%
- 周同比 +20%

**总量**

- 维度总量 -10000（预估值，可改）
- 维度占比 -10%（绝对值变化，比如 12% -> 1% 即符合要求）
- 日同比 -20%
- 周同比 -20%

**失败率**

- 维度失败率 +20%（预估值，可改）
- 维度占比 +10%
- 日同比 +20%
- 周同比 +20%

### nativeAPI 调用

主要考虑三大方面：

- 调用数
- 调用失败率
- 调用耗时

整体参考[网络请求](#网络请求)

### js 异常

在缺少 sourcemap 的情况下，可以按序尝试以下方法：

#### 1. 页面维度分类

> 优先级最高，能快速定位问题出处

- 如果集中在一个页面，即页面主体资源文件有问题；
- 如果分布在不同页面，即这些页面引用的公共资源文件有问题，这种异常修复，尽量在公共文件里解决，通常都是忘记兜底（await 判空、null、条件块未处理等）的情况

#### 2. 应用版本分类

> 优先级中，能排查出现问题的代码版本是否有规律

- 如果集中在某个版本，git diff 就能快速定位出问题代码，
- 如果分布在多个版本，就不必在这个维度看了

#### 3. 异常堆栈

> 优先级低，最终排查途径

未经 sourcemap 处理的堆栈信息往往难以理解，但也并非不可理解



---

## 业界产品

- [乐鹰](https://yueying.effirst.com/#/wbh5demo/h5/page/index)
- [frontJS](https://www.frontjs.com/app/0dbf0572d7a46fe5c1a2093a32ae6b9b/)
- [开源 web-monitoring](https://hubing.online/#/sys/5ea50b485b0dd76c634b9cf7/resourceDetails)
