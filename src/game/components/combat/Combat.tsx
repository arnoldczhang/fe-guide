import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  Row,
} from 'antd';

import AbstractComponent from '../common/AbstractComponent';
import BaseComponent from '../common/BaseComponent';
import ErrorBoundary from '../common/ErrorBoundary';
import CombatScene from './CombatScene';
import CombatOperationArea from './CombatOperationArea';
import { CombatOperationState, CombatProps } from '../../types';
import { Stage, CreateStep } from '../../enum';
import selector from '../../selectors/combat';
import { dispatch } from '../../store';

const styles = require('./Combat.less');

const initialState: CombatOperationState = {
};

const initialProps = {
  stage: Stage.Create_0,
  stepIndex: CreateStep.Person,
};

class Combat extends BaseComponent<CombatProps, CombatOperationState> implements AbstractComponent<CombatProps, CombatOperationState> {
  displayName?: string = 'Combat';
  state: CombatOperationState = initialState;
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
      <ErrorBoundary className={styles.combat}>
        <Row
          className={styles.combat}
          gutter={0}
        >
          <CombatScene />
          <CombatOperationArea />
        </Row>
      </ErrorBoundary>
    );
  }
}

export default connect(selector)(Combat);
