import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from '@rematch/core';

import styles from './Header.less';
import selector from '../../selectors/header';
import logo from '../../logo.svg';

const {
  string,
} = PropTypes;

@connect(selector)
class Header extends PureComponent {
  static propTypes = {
    name: string,
  };

  static defaultProps = {
    name: '',
  };

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    console.log(Object.keys(dispatch));
    dispatch.header.changeTitle('hello world');
    dispatch.header.changeTitleAsync('hello my world');
    console.log(this.props.name);
  }

  render() {
    const {
      name = '',
    } = this.props;

    return (
      <header className={styles['App-header']}>
        <img src={logo} className={styles['App-logo']} alt="logo" />
        <h1 onClick={this.toggle} className={styles['App-title']}>{name}</h1>
      </header>
    );
  }
}

export default Header;
