import * as React from 'react';
// import { connect } from 'react-redux';
import { connect } from './connect';
import selector from './app-selector';
import { StoreProps } from './provider-props';

interface AppProps {
  dispatch: Object;
  children: React.ReactNode; // best
  style?: React.CSSProperties; // for style
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void; // form events!
  props?: React.HTMLProps<HTMLButtonElement> // to impersonate all the props of a HTML element
}

type AppState = {
  name: string,
}

const instanceArray = [];

@connect(selector)
export default class App extends React.PureComponent<{
    // define props
    num: number,
    nummmm: number,
    dispatch: Object,
},
  // define state
  AppState
> {
  props: any = {};
  count: number = 1;

  state = {
    name: 'arnold',
  }

  static getDerivedStateFromProps(props, state) {
    console.log('props', instanceArray, props);
  };

  constructor(props, context) {
    super(props, context);
    instanceArray.push(this);
    console.log('app init');
  }

  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    setTimeout(() => {
      dispatch.count.incrementAsync(this.count++);
    }, 2000);
  }

  render() {
    console.log('app render');
    const {
      num,
      nummmm,
    } = this.props;
    return [
      <div>{num}</div>,
      <div>{nummmm}</div>,
      <div>{this.state.name}</div>,
      <div>abc</div>,
      <div>abc</div>
    ];
  }
}

