import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from '@rematch/core';

import styles from './Header.less';
import selector from '../../selectors/header';
import logo from '../../logo.svg';

const {
  number,
  string,
} = PropTypes;

@connect(selector)
class Header extends PureComponent {
  static propTypes = {
    numm: number,
    name: string,
  };

  static defaultProps = {
    numm: 0,
    name: '',
  };

  constructor() {
    super();
    this.aa = this.aa.bind(this);
  }

  aa() {
    dispatch.count.increment(100);
    console.log(this);
  }

  render() {
    const {
      numm,
      name = '',
    } = this.props;

    return (
      <header className={styles['App-header']}>
        {numm}
        {
          name ? (<span>name: {name}</span>) : null
        }
        <img src={logo} className={styles['App-logo']} alt="logo" />
        <h1 onClick={this.aa} className={styles['App-title']}>Welcome to React</h1>
      </header>
    );
  }
}

export default Header;
