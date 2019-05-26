# 类型检查

参考[类型检查](https://juejin.im/post/5cd7f2c4e51d453a7d63b715)

## 函数组件
- 使用`ComponentNameProps`形式命名 Props 类型, 并导出
  ```jsx
  // 声明Props类型
  export interface MyComponentProps {
    className?: string;
    style?: React.CSSProperties;
    // 手动声明children
    children?: React.ReactNode;
  }
  ```
- 优先使用FC类型来声明函数组件
  ```jsx
  import React, { FC } from 'react';

  // FC形式
  export const MyComponent: FC<MyComponentProps> = props => {
    return <div>hello react</div>;
  };

  // 普通函数形式
  export function MyComponent(props: MyComponentProps) {
    return <div>hello react</div>;
  }
  ```




## class组件


## 高阶组件


## render Props


## Context


## 其他


