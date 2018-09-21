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


## webpack 4+参考
  - https://juejin.im/entry/5b63eb8bf265da0f98317441
  - js拆包：https://mp.weixin.qq.com/s/a946nG0oNYnDBMMwgtDBpA
  




