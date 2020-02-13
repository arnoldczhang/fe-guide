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
* [`监控大盘`](#监控大盘)
* [`治理工单`](#治理工单)

</details>

## 背景
>
> 应用性能管理（Application Performance Management）是一个比较新的网络管理方向，
>
> 主要指对企业的关键业务应用进行监测、优化，提高企业应用的可靠性和质量，保证用户得到良好的服务，降低IT总拥有成本(TCO)。
>
> 使用全业务链的敏捷APM监控，可使一个企业的关键业务应用的性能更强大，可以提高竞争力，并取得商业成功，
>
> 因此，加强应用性能管理（APM）可以产生巨大商业利益。

---

## 业务现状

---

## 解决价值

---

## 监控流程

| 事前 | 事中 | 事后 |
| -------- | -----: | :----: | 
| 设置预警 | 触发预警 | 完善预警 |
| 配置埋点 | 人工干预 | 完善埋点 |
|  |  | casestudy |

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
| --------   | -----:   | -----:   | :----: | 
| AS | 应用启动 | 启动并加载第一个页面，或者从后台切回 | 静默 |
| AD | 应用退出 | 应用切换到退出后台，应用被Kill | 静默 |
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
| --------   | -----:   | -----:  | :----: | 
| FP | 首次绘制 | | 静默 |
| FCP | 首次内容绘制 | | 静默 |
| FMP | 首次有效绘制 | 主角元素呈现在屏幕上的时刻 | 静默 |
| TTI | 可交互时间 | 页面处于idle的时间 | 静默 |
| FPS | 画面每秒传输帧数 | | 静默 |

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

## 治理工单

