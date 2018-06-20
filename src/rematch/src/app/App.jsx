import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from '@rematch/core';

import styles from './App.css';
// import logo from '../logo.svg';
import Header from '../components/header/Header.jsx';
import selector from '../selectors/app';

const {
  number,
} = PropTypes;

@connect(selector)
class App extends PureComponent {
  static propTypes = {
    numm: number,
    num: number,
  };

  static defaultProps = {
    numm: 0,
    num: 0,
  };

  constructor(props) {
    super(props);
    this.increase = this.increase.bind(this);
  }

  componentDidMount() {
  }

  increase() {
    // dispatch.count.increment(100);
    // dispatch.count.incrementSaga(100);
    dispatch.count.incrementAsync(101);
    dispatch.calculate.incrementAsync(101);
    console.log(this);
  }

  render() {
    const {
      numm,
      num,
    } = this.props;

    return [
      <div className={styles.App} key="App">
        <button onClick={this.increase}>click</button>
        {React.cloneElement(<Header />, {
          name: 'arnold',
        })}
        <Header />
        {numm},,{num}
      </div>,
    ];
  }
}

export default App;
