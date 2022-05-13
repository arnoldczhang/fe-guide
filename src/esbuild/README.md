# esbuild
> es6的 javascript 打包工具

## 参考
- [官方API](https://esbuild.github.io/api/)
- [esbuild打包node项目](https://devtails.medium.com/bundling-your-node-js-express-app-with-esbuild-5aecc36c5047)
- [esbuild打包react项目](https://devtails.xyz/how-to-replace-webpack-in-create-react-app-with-esbuild)

---

## esbuild/swc

[ESBuild & SWC浅谈: 新一代构建工具](https://mp.weixin.qq.com/s?__biz=MzkxNTIwMzU5OQ==&mid=2247493641&idx=1&sn=f8378c131fe43e7d4ef41ce9f01a1bde&chksm=c1601b69f617927fc4fcc9ad19cd34598fae06109e18a44fc8e6c7aee98fc72d58ea755d0360&token=1008676742&lang=zh_CN&scene=21#wechat_redirect)



### 定位

从[前端工程化](../career/前端工程化.md)角度来讲：

esbuild：bundler

swc：compiler + bundler



### esbuild优势

**aot VS jit**

由go实现，运行时即已优化

**高并发**

解析(Parsing), 链接(Linking)和代码生成(Code generation)，三个环节都利用多核并行计算

**复用**

传统bundler（比如webpack），可能由于第三方接入带来性能问题（打包过程多次 ast <--> code），相当浪费资源，

esbuild会从零开始实现大部分功能，会尽量避免此情况，不过用户真要来回转也是无法避免的。



