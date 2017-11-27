## webpack-3.8.1解析

- 主体
    - webpackOptionsValidationErrors
      - 使用ajv校验options的json格式
    - WebpackOptionsDefaulter
      - 填充默认配置项
    - NodeEnvironmentPlugin
      - 绑定文件内容变更的监控（输入、输出、监听、缓存）
    - compiler.apply.apply(compiler, options.plugins)
      - 执行plugins
    - WebpackOptionsApply
      -