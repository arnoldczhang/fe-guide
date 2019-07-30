# jsbridge

## 参考
- [JSBridge的原理](https://juejin.im/post/5abca877f265da238155b6bc)

## 原理

### js调用native
- 注入api
- 拦截url schema

#### 注入api
```js
// Android
window.nativeBridge.postMessage(message);
// iOS 的 WKWebView
window.webkit.messageHandlers.nativeBridge.postMessage(message);
```

#### 拦截url schema
- iframe.src发送url schema请求（比如baidu://bd/url?url=bdfe.tech）
- native拦截schema请求，根据所带参数执行相应操作

**优点**

- 兼容到ios6

**缺点**

- url长度有隐患
- 创建请求有耗时，比调用注入的api久
- ios6占比太小，目前不该再用schema这种方式了

**为什么不用location.href**

location.href连续调用native，会造成部分调用丢失

### native调用js
- ios
  * uiWebview.stringByEvaluatingJavaScriptFromString
  * wkWebView.evaluateJavaScript
- android
  * webView.loadUrl("javascript:" + javaScriptString)
  * webView.evaluateJavascript

---

## 实现
- 每次invoke设置唯一callbackId（用于native的回调）
- 根据不同环境调用不同nativeBridge
- 收到native的响应时，获得bridgeName、callbackId、responseId
- 执行callbackId相应回调
- 根据responseId响应native的回调

```js
(function () {
    var id = 0,
        callbacks = {},
        registerFuncs = {};

    window.JSBridge = {
        // 调用 Native
        invoke: function(bridgeName, callback, data) {
            // 判断环境，获取不同的 nativeBridge
            var thisId = id ++; // 获取唯一 id
            callbacks[thisId] = callback; // 存储 Callback
            nativeBridge.postMessage({
                bridgeName: bridgeName,
                data: data || {},
                callbackId: thisId // 传到 Native 端
            });
        },
        receiveMessage: function(msg) {
            var bridgeName = msg.bridgeName,
                data = msg.data || {},
                callbackId = msg.callbackId, // Native 将 callbackId 原封不动传回
                responstId = msg.responstId;
            // 具体逻辑
            // bridgeName 和 callbackId 不会同时存在
            if (callbackId) {
                if (callbacks[callbackId]) { // 找到相应句柄
                    callbacks[callbackId](msg.data); // 执行调用
                }
            } elseif (bridgeName) {
                if (registerFuncs[bridgeName]) { // 通过 bridgeName 找到句柄
                    var ret = {},
                        flag = false;
                    registerFuncs[bridgeName].forEach(function(callback) => {
                        callback(data, function(r) {
                            flag = true;
                            ret = Object.assign(ret, r);
                        });
                    });
                    if (flag) {
                        nativeBridge.postMessage({ // 回调 Native
                            responstId: responstId,
                            ret: ret
                        });
                    }
                }
            }
        },
        register: function(bridgeName, callback) {
            if (!registerFuncs[bridgeName])  {
                registerFuncs[bridgeName] = [];
            }
            registerFuncs[bridgeName].push(callback); // 存储回调
        }
    };
})();
```

---

## 引用
- native端注入
- js端引用
