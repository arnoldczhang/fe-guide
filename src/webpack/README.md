# webpack


## 目录
<details>
<summary>展开更多</summary>

* [`webpack-3.8.1解析`](#webpack-3.8.1解析)
* [`webpack 4`](#webpack 4)
* [`注意事项`](#注意事项)

</details>

## 参考
- [tapable插件机制解析](https://segmentfault.com/a/1190000017420937)
- [webpack4js拆包](https://mp.weixin.qq.com/s/a946nG0oNYnDBMMwgtDBpA)
- [webpack4配置指南](https://mp.weixin.qq.com/s/cX7yuneDxDk8_NnMy3Bc8Q)
- [webpack4配置指南2](https://mp.weixin.qq.com/s/si4yq-M_JS0DqedAhTlKng)

## webpack-3.8.1解析

- 主体
    - 支持webpack([conf1, conf2], callback)
    - webpackOptionsValidationErrors
      - 使用ajv校验options的json格式
    - Compiler
      - 编译器，生命周期会触发n多hooks...，插件要在不同hooks中做些callback
    - WebpackOptionsDefaulter
      - 填充默认配置项
    - NodeEnvironmentPlugin
      - 绑定文件内容变更的监控（输入、输出、监听、缓存）
    - compiler.apply.apply(compiler, options.plugins)
      - 执行plugins
    - WebpackOptionsApply
      - 定义打包出来的模板
        - JsonpTemplatePlugin
          - this-compilation
        - FunctionModulePlugin
          - compilation
        - NodeSourcePlugin
          - compilation
          - after-resolvers
        - LoaderTargetPlugin
          - compilation
          - normal-module-loader
        - EntryOptionPlugin
          - entry-option
        - ...

## webpack 4
[参考](https://juejin.im/entry/5b63eb8bf265da0f98317441)

### 相比webpack3
* 4多了mode字段，用于切换开发/生成环境
* 4支持了读取npm依赖的module字段，es6module
- 2、3的摇树会判断，如果方法有入参，或操纵了window，则不会摇掉，因为这些函数有副作用
  4的摇树默认会摇掉，如果sideEffect置为false，则不摇
 
## 注意事项
- 使用 import()，需要dynamic-import插件 (https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import/)
- ![import](import-polyfill.png)



