# 类型检查

参考[类型检查](https://juejin.im/post/5cd7f2c4e51d453a7d63b715)

## 函数组件
- 使用**ComponentNameProps**形式命名 Props 类型, 并导出
  ```jsx
  // 声明Props类型
  export interface Props {
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
  export const MyComponent: FC<Props> = props => {
    return <div>hello react</div>;
  };

  // 普通函数形式
  export function MyComponent(props: Props) {
    return <div>hello react</div>;
  }
  ```
- 避免直接使用export default导出组件
  react Inspector查看会显示unknown（平时call stack调试也是这样，函数尽量命名）
  ```jsx
  // 给export default的函数命名
  export default function Foo(props: {}) {
    return <div>xxx</div>;
  }
  ```
- 默认 props 声明
  ```jsx
  // 推荐做法
  export interface Props {
    name?: string; // 声明为可选属性
  }

  export const Hello: FC<Props> = ({
    name = 'TJ',
  }) => <div>Hello {name}!</div>;

  // ts3.1+做法，3.1-可能会提示defaultProps未定义
  const Hello = ({
    id,
  }: PropsWithChildren<Props>) => (
    <div>Hello {id}!</div>
  );

  Hello.defaultProps = {
    id: 123,
  } as Partial<Props>;
  ```
- 泛型
  ```jsx
  interface ListProps<T> {
    visible: boolean;
    /*自动推断i为number类型*/
    list: T[];
    renderItem: (item: T, index?: number) => ReactNode;
  }

  function List<T>(props: ListProps<T>) {
    const { list, renderItem } = props;
    return (
      <div>
        {
          list.map(it => renderItem(it))
        }
      </div>
    );
  };

  /*
  <List
    visible={true}
    list={[1,2,3]}
    renderItem={(i) => {
      return <div>{i}</div>;
    }}
  />
  */
  ```
- 子组件声明
  ```jsx
  interface LayoutProps {

  }
  interface LayoutHeaderProps {
    title: string;
  }
  interface LayoutFooterProps {
  }

  function Layout(props: PropsWithChildren<LayoutProps>) {
    return <div className="layout">{props.children}</div>;
  };

  Layout.Header = (props: PropsWithChildren<LayoutHeaderProps>) => {
    return <header>{props.title}</header>;
  };

  Layout.Footer = (props: PropsWithChildren<LayoutFooterProps>) => {
    return <footer>{props.children}</footer>;
  };

  /*
  <Layout>
    <Layout.Header title="title"></Layout.Header>
    <Layout.Footer>company</Layout.Footer>
  </Layout>
  */
  ```
- Forwarding Refs
  [React.forwardRef](https://juejin.im/post/5c0dd44b51882530e4617e92) 在 16.3 新增, 可以用于转发 ref, 适用于 HOC 和函数组件

  暂未看出具体价值，只要用于通过ref控制封装组件的底层dom
  
## class组件
- 使用static defaultProps定义默认 props
  Typescript 3.0开始支持对使用 defaultProps 对 JSX props 进行推断, 在 defaultProps 中定义的 props 可以不需要'?'可选操作符修饰
- 继承 Component 或 PureComponent
  ```jsx
  interface Props {
    name: string;
  }
  interface State {
    count: number;
  }

  class Foo extends Component<Props, State> {

    public static defaultProps = {
      name: 'test',
    }

    public state = {
      count: 1,
    }

    private increment = () => {
      this.setState(({ count }) => ({ count: count + 1 }));
    };

    public render() {
      return (
        <div>
          {this.state.count}
          <button onClick={this.increment}>Increment</button>
        </div>
      );
    }
  }
  ```
- 子组件声明
  ```jsx
  interface LayoutProps {

  }

  interface LayoutState {
    count: number;
  }

  interface LayoutHeaderProps {
    title: string;
  }
  interface LayoutFooterProps {
  }

  const Header = (props: PropsWithChildren<LayoutHeaderProps>) => {
    return <header>{props.title}</header>;
  };

  const Footer = (props: PropsWithChildren<LayoutFooterProps>) => {
    return <header>{props.children}</header>;
  };

  class Layout extends Component<LayoutProps, LayoutState> {
    public static Header = Header;
    public static Footer = Footer;

    public render() {
      return <div className="layout">{this.props.children}</div>;
    }
  }
  ```
- 泛型
  ```jsx
  interface ListProps<T> {
    visible: boolean;
    list: T[];
    renderItem: (item: T, index?: number) => ReactNode;
  }

  interface ListState {

  }

  class List<T> extends Component<ListProps<T>, ListState> {
    public render() {
      const { list, renderItem } = this.props;
      return <div>{
        list.map(it => renderItem(it))
      }</div>;
    }
  }

  /*
  <List
    visible={true}
    list={[1,2,3]}
    renderItem={(i) => {
      return <div>{i}</div>;
    }}
  />
  */
  ```



## 高阶组件


## render Props


## Context


## 其他


