# jsbridge

## 参考
- [JSBridge的原理](https://juejin.im/post/5abca877f265da238155b6bc)

## 目录
<details>
<summary>展开更多</summary>

* [`原理`](#原理)
* [`callback实现`](#callback实现)
* [`实例-注入api方式`](#实例-注入api方式)
* [`实例-拦截url`](#实例-拦截url)
* [`webview加载html`](#webview加载html)

</details>

## 原理

### js调用native
- 方式1：注入api
- 方式2：拦截url schema

#### 注入api
```java
// Android
class JSInterface {
    @JavascriptInterface //注意这个代码一定要加上
    public String getUserData() {
        return "UserData";
    }
}
webView.addJavascriptInterface(new JSInterface(), "AndroidJS");
```

在js里可以直接调用方法
```js
AndroidJS.getUserData();
```

#### 拦截url schema
- iframe.src发送url schema请求（比如baidu://bd/url?url=bdfe.tech）
- location.href

```js
// iframe方式
var url = 'jsbridge://doAction?title=分享标题&desc=分享描述&link=http%3A%2F%2Fwww.baidu.com';
var iframe = document.createElement('iframe');
iframe.style.width = '1px';
iframe.style.height = '1px';
iframe.style.display = 'none';
iframe.src = url;
document.body.appendChild(iframe);
setTimeout(function() {
    iframe.remove();
}, 100);
```

**优点**

- 兼容到ios6

**缺点**

- url长度有隐患
- 创建请求有耗时，比调用注入的api久
- ios6占比太小，目前不该再用schema这种方式了

**为什么不用location.href**

location.href连续调用native，会造成部分调用丢失，只有最后一个生效

### native调用js
- ios
  * uiWebview.stringByEvaluatingJavaScriptFromString
  * wkWebView.evaluateJavaScript
- android
  * webView.loadUrl("javascript:" + javaScriptString)
  * webView.evaluateJavascript

---

## callback实现
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

### 对callback的处理
- js传设置callbackId给native
- native原封不动返回callbackId
- js根据callbackId执行对应的callback

---

## 实例-注入api方式

### native处理
```java
// native调用js注册的方法functionInJs
webView.callHandler("functionInJs", new Gson().toJson(user), new CallBackFunction() {
    @Override
    public void onCallBack(String data) {

    }
});

// native注册的方法submitFromWeb
webView.registerHandler("submitFromWeb", new BridgeHandler() {
  @Override
  public void handler(String data, CallBackFunction function) {
    // TODO
  }

});
```

### js处理
```js
// bridge初始化
function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge)
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady'
      , function() {
        callback(WebViewJavascriptBridge)
      },
      false
    );
  }
};

connectWebViewJavascriptBridge(function(bridge) {
  bridge.init(function(message, responseCallback) {
    console.log('JS got a message', message);
    var data = {
      'Javascript Responds': '测试中文!'
    };
    if (responseCallback) {
      console.log('JS responding with', data);
      responseCallback(data);
    }
  });

  // 为native注册functionInJs方法
  bridge.registerHandler("functionInJs", function(data, responseCallback) {
    document.getElementById("show").innerHTML = ("data from Java: = " + data);
    if (responseCallback) {
      var responseData = "Javascript Says Right back aka!";
      responseCallback(responseData);
    }
  });
});

// 调用native方法submitFromWeb
window.WebViewJavascriptBridge.callHandler(
  'submitFromWeb'
  , {'param': '中文测试'}
  , function(responseData) {
    document.getElementById("show").innerHTML = "send get responseData from java, data = " + responseData
  }
);
```

---

## 实例-拦截url
- 在UIWebview里发起任意网络请求，比如jsbridge://methodName?param1=value1&param2=value2
- UIWebview通过delegate函数获取网络请求的通知
- delegate内对约定的网络请求进行捕获处理（而非直接跳转）

```oc
func webView(
    webView: UIWebView,
    shouldStartLoadWithRequest request: NSURLRequest,
    navigationType: UIWebViewNavigationType
) -> Bool {
    let url = request.URL
    let scheme = url?.scheme
    let method = url?.host
    let query = url?.query
    
    if url != nil && scheme == "jsbridge" {
        print("scheme == \(scheme)")
        print("method == \(method)")
        print("query == \(query)")

        switch method! {
            case "getData":
                self.getData()
            case "putData":
                self.putData()
            default:
                print("default")
        }
        return false
    } else {
        return true
    }
}
```

### js处理
```js
var WVJBIframe = document.createElement('iframe');
WVJBIframe.style.display = 'none';
WVJBIframe.src = 'https://__bridge_loaded__';
document.documentElement.appendChild(WVJBIframe);
setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe)
}, 0);
```

---

## webview加载html的四种方式

1. 加载url
```java
webView.loadUrl("http://139.196.35.30:8080/OkHttpTest/apppackage/test.html");
```

2. 加载asset文件夹下html
```java
webView.loadUrl("file:///android_asset/test.html");
```

3. 加载手机sdcard上的html页面
```java
webView.loadUrl("content://com.ansen.webview/sdcard/test.html");
```

4. 使用webview显示html代码
```java
webView.loadDataWithBaseURL(null,"<html><head><title> 欢迎您 </title></head>" + "<body><h2>使用webview显示 html代码</h2></body></html>", "text/html" , "utf-8", null);
```




