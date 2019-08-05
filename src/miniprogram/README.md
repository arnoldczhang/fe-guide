# 微信小程序

## 参考
- [原理](https://www.cnblogs.com/freeliver54/p/9024999.html)

## 打包工具
- [参考](./build.js)

## 微信小程序解析流程
- setData L.26067
- doUpdates L.24544
- diff L.29743
- applyDomOperation L.29862
- flushSendingData L.28318
- vdSyncBatch L.23839
- render

---

## 实现原理
- 每个小程序至少占用两个webview：appView和appService
- 由于这个原因，所以有有页面层级5层的限制

#### appService
- 负责逻辑处理
- 底层由WAService.js提供各种api接口（调试模式是asdebug.js）
  * 日志组件reporter
  * wx原生api
  * App、Page、Component等全局方法
  * amd模块实现
- 消息通信封装为weixinJSBridge

#### appView
- 负责视图渲染
- 底层由WAWebview.js提供各种api接口
  * 日志组件
  * wx原生api（和处理ui显示相关的）
  * 组件实现
  * 虚拟节点diff
  * render UI
  * 事件触发
- 通过$gwx模板方法，将wxml转为虚拟节点，最终在webview渲染（与普通h5的差异）
- 渲染的实现方式类似web-component

---

## 获取用户信息相关

### 获取code
```js
wx.login({
  success(res) {
    /**
     * 返回值
     * {
     *    code: "CODE"
     *    errMsg: "login:ok"
     * }
     */
    console.log(res.code);
  }
});
```

### 获取session_key
```js
request({
  url: 'https://api.weixin.qq.com/sns/jscode2session',
  json: true,
  qs: {
    appid, // 小程序 appId
    secret, // 小程序 appSecret
    js_code: code,  // 登录code
    grant_type: 'authorization_code',
  },
}).then((res) => {
  /**
  * 返回值
  * {
  *   openid: "openid", // 用户唯一标识
  *   session_key: "session_key", // 会话密钥
  *   unionid: "unionid", // 用户在开放平台的唯一标识符，在满足 UnionID 下发条件的情况下会返回
  * }
  */
});
```

### 检查是否需要更新session_key
```js
wx.checkSession({
  success() {
    // session_key 未过期，并且在本生命周期一直有效
  },
  fail() {
    // session_key 已经失效，需要重新执行登录流程
    wx.login() // 重新登录
  }
});
```

### 签名校验
1. getUserInfo点击按钮获取用户信息
```js
// rawData
{
 "nickName": "Band",
 "gender": 1,
 "language": "zh_CN",
 "city": "Guangzhou",
 "province": "Guangdong",
 "country": "CN",
 "avatarUrl": "avatarUrl"
}

// signature
'signature=='
```
2. 服务端依据signature = sha1( rawData + session_key )，加密后对比前后签名是否一致
```js
const crypto = require('crypto');
const session_key = 'session_key';
const shasum = crypto.createHash('sha1');
shasum.update(rawData + session_key);
const realSignature = shasum.digest('hex');
console.log(realSignature === signature); // true签名校验通过
```

### 信息解密
1. getphonenumber点击按钮获取用户信息
```js
{
  encryptedData: "encryptedData=="
  errMsg: "getPhoneNumber:ok"
  iv: "iv=="
}
```

2. 服务端解密
```js
const crypto = require('crypto');
const sessionKey = new Buffer(session_key, 'base64');
const encryptedData = new Buffer(encryptedData, 'base64');
const iv = new Buffer(iv, 'base64');
const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
// 设置自动 padding 为 true，删除填充补位
decipher.setAutoPadding(true);
let decoded = decipher.update(encryptedData, 'binary', 'utf8');
decoded += decipher.final('utf8');
decoded = JSON.parse(decoded);

/**
 * decoded
 *
 * {
 *  "phoneNumber": "phoneNumber",
 *  "purePhoneNumber": "purePhoneNumber",
 *  "countryCode": "86",
 *  "watermark": {
 *    "appid": "APPID",
 *    "timestamp": TIMESTAMP
 *   }
 * }
 */
console.log(decoded);
```




