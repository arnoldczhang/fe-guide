import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { dispatch } from '@rematch/core';
import selector from '../../selectors/header';

const styles = require('./Header.less');
const logo = require('../../logo.svg');

const initialState = {
  show: false,
};

const initialProps = {
  name: '',
};

export type State = Partial<{
  show: boolean;
}>;

export type Props = Partial<{
  children: React.ReactNode;
  name: string;
}>;

class Header extends PureComponent<Props, State> {
  props: Props = initialProps;
  state: State = initialState;

  constructor(props: Props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    console.log(Object.keys(dispatch));
    dispatch.header.changeTitle('hello world');
    this.setState({
      show: true,
    });
    dispatch.header.changeTitleAsync('hello my world');
    console.log(this.props.name);
  }

  render() {
    const {
      name,
    } = this.props;
    const {
      show,
    } = this.state;

    return (
      <header className={styles['App-header']}>
        <img src={logo} className={styles['App-logo']} alt="logo" />
        <h1 onClick={this.toggle} className={styles['App-title']}>{name}</h1>
        {
          show ? (<span>loading...</span>) : null
        }
      </header>
    );
  }
}

export default connect(selector)(Header);
