# reactlike

## 功能函数
  - ### createElement
    - #### 入参
      - type, config, children
    - #### 解析
      1. 过滤有效（非保留字段、非继承字段）props
      2. defaultProps（props对应字段，值为void 0时）赋值
      3. 处理children，结果为数组或child对象（单个子节点时）
      4. next -> ReactElement
  - ### ReactElement
    - #### 入参
      - type, tag, props, key, ref, owner
    - #### 解析
      - 根据ref类型处理、赋值；绑定_owner