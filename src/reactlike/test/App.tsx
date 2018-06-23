import * as React from 'react';
// import { connect } from 'react-redux';
import { connect } from './connect';
import selector from './app-selector';
import { StoreProps } from './provider-props';
import * as PropTypes from 'prop-types';

const {
  number,
  object,
} = PropTypes;

@connect(selector)
export default class App extends React.PureComponent {
  props: any = {};
  count: number = 1;

  static propTypes = {
    num: number.isRequired,
    nummmm: number.isRequired,
    dispatch: object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
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
      <div>abc</div>,
      <div>abc</div>,
      <div>abc</div>
    ];
  }
}

