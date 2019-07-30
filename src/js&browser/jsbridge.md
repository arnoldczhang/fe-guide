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




