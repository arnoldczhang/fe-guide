import React, { FC, ReactNode, PropsWithChildren, Component } from 'react';
import { hydrate } from 'react-dom';

// export interface Props {
//   id?: number;
//   children?: ReactNode;
// }

// export const Comp: FC<Props> = ({
//   id = 11223,
// }) => (
//     <div>{id}</div>
// );

// export default function Foo(props: {}) {
//   return <div>xxx</div>;
// }

// const Hello = ({
//   id,
// }: PropsWithChildren<Props>) => (
//   <div>Hello {id}!</div>
// );

// Hello.defaultProps = {
//   id: 123,
// } as Partial<Props>;

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

// function List<T>(props: ListProps<T>) {
//   const { list, renderItem } = props;
//   return (
//     <div>
//       {
//         list.map(it => renderItem(it))
//       }
//     </div>
//   );
// }

// interface LayoutProps {

// }

// interface LayoutState {
//   count: number;
// }

// interface LayoutHeaderProps {
//   title: string;
// }
// interface LayoutFooterProps {
// }

// const Header = (props: PropsWithChildren<LayoutHeaderProps>) => {
//   return <header>{props.title}</header>;
// };

// const Footer = (props: PropsWithChildren<LayoutFooterProps>) => {
//   return <header>{props.children}</header>;
// };

// class Layout extends Component<LayoutProps, LayoutState> {
//   public static Header = Header;
//   public static Footer = Footer;

//   public render() {
//     return <div className="layout">{this.props.children}</div>;
//   }
// }

// function Layout(props: PropsWithChildren<LayoutProps>) {
//   return <div className="layout">{props.children}</div>;
// };

// Layout.Header = (props: PropsWithChildren<LayoutHeaderProps>) => {
//   return <header>{props.title}</header>;
// };

// Layout.Footer = (props: PropsWithChildren<LayoutFooterProps>) => {
//   return <footer>{props.children}</footer>;
// };

// interface Props {
//   name: string;
// }
// interface State {
//   count: number;
// }

// class Foo extends Component<Props, State> {

//   public static defaultProps = {
//     name: 'test',
//   }

//   public state = {
//     count: 1,
//   }

//   private increment = () => {
//     this.setState(({ count }) => ({ count: count + 1 }));
//   };

//   public render() {
//     return (
//       <div>
//         {this.state.count}
//         <button onClick={this.increment}>Increment</button>
//       </div>
//     );
//   }
// }

hydrate(
  // <Hello />,
  <List
    visible={true}
    list={[1,2,3]}
    renderItem={(i) => {
      return <div>{i}</div>;
    }}
  />,
  // <Layout>
  //   <Layout.Header title="title"></Layout.Header>
  //   <Layout.Footer>company</Layout.Footer>
  // </Layout>,
  // <Foo name="abc" />,
  document.getElementById('root')
);
