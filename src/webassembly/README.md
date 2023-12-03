# webassembly

## 参考
  - https://mbebenita.github.io/WasmExplorer/
  - https://mp.weixin.qq.com/s/bm1JPMyezHIC9ThdTvCu2g
  - https://mp.weixin.qq.com/s/AiKvAnTWq1rS4oC8nnxCfQ
  - [webassembly解释器实现](https://mp.weixin.qq.com/s?__biz=MzI1NTg3NzcwNQ==&mid=2247485110&idx=1&sn=8f230298786868dd48025d49dfc4afde&scene=21#wechat_redirect)
  - [import and export](https://mp.weixin.qq.com/s/MPBwFuL2CYFVXIowoB542A)



## 解释器

可以[参考](https://wasdk.github.io/wasmcodeexplorer/)，了解二进制格式和文本的对应关系。



## 现状

- 目前没有提供 javascript 向 webassembly 的转换，只有类似 typescript 的语法（AssemblyScript）转换，但不完全一致
- wasm 的作用，是可以将桌面端的能力打包后提供给浏览器使用
- 并不完全为浏览器而生



## 库
- [webassembly的npm](https://wapm.io/)



## 模块化

[webassembly模块化](https://mp.weixin.qq.com/s?__biz=Mzg2ODQ1OTExOA==&mid=2247503481&idx=1&sn=9bad90611cc2ba3e906608f96a6d6709&scene=21#wechat_redirect)



## 调试

| **调试方式**               | **优势**                                     | **不足**                                                     |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| Native                     | 可使用成熟的调试工具工具熟悉、零学习成本     | 无法复现 wasm 强相关的问题需要维护原生产物的编译路径         |
| lldb+wasmtime              | 类似于 Native+lldb 的体验wasm 环境下进行调试 | 变量信息还不支持打印, 只能用日志断点之后显示信息无效         |
| lldb+iwasm                 | 类似于 Native+lldb 的体验wasm 环境下进行调试 | 需要自行编译 lldb 和 iwasm编译模式下的调试步骤较为复杂       |
| Chrome Devtool & DWARF插件 | 调试功能完善wasm 环境中调试                  | 需要使用 emcc 等工具引入了 html/js, 增加了复杂度wasi 只能用浏览器的类似接口模拟, 行为可能不一致 |
| WasmInspect                | 独立工具，开箱即用                           | 功能不完备项目长时间无更新, 不跟随 wasm 规范迭代             |
