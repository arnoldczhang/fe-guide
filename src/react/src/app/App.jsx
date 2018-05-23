import React, { PureComponent } from 'react';
import Hotkeys from 'react-hot-keys';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import logo from '../logo.svg';
import styles from './App.css';
import appSelector from '../selectors/app';
import {
  actionInitApp,
} from '../actions';

const {
  number,
  func,
} = PropTypes;

@connect(appSelector)
class App extends PureComponent {
  static propTypes = {
    inited: number.isRequired,
    dispatch: func.isRequired,
  };

  static defaultProps = {
  };

  onKeyDown(e) {
    console.log(e);
  }

  componentDidMount() {
  }

  render() {
    const {
      inited,
      dispatch,
    } = this.props;

    actionInitApp(dispatch);

    return [
      <div className={styles.App} key="App">
        <header className={styles['App-header']}>
          <img src={logo} className={styles['App-logo']} alt="logo" />
          <h1 className={styles['App-title']}>{inited ? 'Welcome to React' : 'Waiting'}</h1>
        </header>
        <Hotkeys
          keyName="shift+a,alt+s"
          onKeyDown={this.onKeyDown.bind(this)}
        >
          <input type="text" />
        </Hotkeys>
        <p className={styles['App-intro']}>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>,
    ];
  }
}

export default App;
