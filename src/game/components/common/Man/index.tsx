import React, { PureComponent, ReactNode } from 'react';

import AbstractComponent from '../../common/AbstractComponent';
import { ManState, ManProps } from '../../../types';

const styles = require('./index.less');
const staticBladeMan = require('../../../img/blade-man-static.gif');
const bladeMan = require('../../../img/blade-man.jpg');
// const runMan = require('../../../img/run-man.gif');

const initialState = {
  active: false,
  baseDistance: 6.0,
};

const initialProps = {
  dist: 6.0,
};

export default class Man extends PureComponent<ManProps, ManState>
  implements AbstractComponent<ManProps, ManState> {
  displayName?: string = 'Man';
  state: ManState = initialState;
  static defaultProps = initialProps;

  constructor(props: ManProps) {
    super(props);
    this.bindInstance();
  }

  componentDidUpdate() {

  }

  bindInstance() {
    this.activate = this.activate.bind(this);
  }

  activate() {
      this.setState({
          active: !this.state.active,
      });
  }

  render(): ReactNode {
    const {
      dist,
    } = this.props;
    const {
      baseDistance,
      active,
    } = this.state;
    const diff = (dist - baseDistance) * 100;
    return (
        <img className={styles.man} style={{ transform: `scale(-1, 1) translateX(${diff + '%'})` }} onClick={this.activate} src={ active ? bladeMan : staticBladeMan} />
      );
  }
}
