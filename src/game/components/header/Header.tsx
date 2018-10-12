import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { DatePicker } from 'antd';

import selector from '../../selectors/header';

const styles = require('./Header.less');
const logo = require('../../logo.svg');

const initialState = {
  show: false,
};

const initialProps = {
  name: '',
  dispatch: (v: any) => v,
};

export type State = Partial<{
  show: boolean;
}>;

export type Props = Partial<{
  children: React.ReactNode;
  dispatch: Function|any;
  name: string;
}>;

class Header extends PureComponent<Props, State> {
  state: State = initialState;
  static defaultProps = initialProps;

  constructor(props: Props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { dispatch } = this.props;
    console.log(Object.keys(dispatch));
    dispatch.header.changeTitle('hello world');
    this.setState({
      show: true,
    });
    dispatch.header.changeTitleAsync('hello my world');
    console.log(this.props.name);
  }

  render() {
    // console.log(this);
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
        <DatePicker />
      </header>
    );
  }
}

export default connect(selector)(Header);
