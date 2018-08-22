import React from 'react';
import ReactDOM from 'react-dom';
import { State, connect } from 'bbx';

// 定义一个状态类
class Hello extends State {
  state = { say: 'hello 👶' }
  hi() { this.setState({ say: 'hi !' }) }
}

// 实例化这个类
const hello = new Hello();

@connect(hello)
class Example extends React.Component{
  render() {
    return (
      <div>
        <label>{hello.state.say}</label>
        <button onClick={() => hello.hi()}>hi</button>
      </div>
    );
  }
}

// 连接这个实例到 React 组件
class App extends React.Component {
  render() {
    return (
      <div>
        <Example />
        <Example />
        <Example />
        <Example />
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'))