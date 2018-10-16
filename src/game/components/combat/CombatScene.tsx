import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Button,
} from 'antd';

import AbstractComponent from '../common/AbstractComponent';
import BaseComponent from '../common/BaseComponent';
import ErrorBoundary from '../common/ErrorBoundary';
import { CombatState, CombatProps } from '../../types';
import { Stage, CreateStep } from '../../enum';
import selector from '../../selectors/combat';
import { dispatch } from '../../store';

const styles = require('./Combat.less');

const ButtonGroup = Button.Group;

const initialState: CombatState = {
};

const initialProps = {
  stage: Stage.Create_0,
  stepIndex: CreateStep.Person,
};

class CombatScene extends BaseComponent<CombatProps, CombatState> implements AbstractComponent<CombatProps, CombatState> {
  displayName?: string = 'Combat';
  state: CombatState = initialState;
  static defaultProps = initialProps;

  constructor(props: CombatProps) {
    super(props);
    this.bindInstance();
  }

  bindInstance(): void {
  }

  handleClick() {
    console.log(1);
  }

  render(): ReactNode {
    return (
      <ErrorBoundary>
        <Row className={styles['combat-scene']}>
        </Row>
      </ErrorBoundary>
    );
  }
}

export default connect(selector)(CombatScene);
