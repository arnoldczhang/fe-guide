import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import {
  Row,
} from 'antd';

import AbstractComponent from '../common/AbstractComponent';
import BaseComponent from '../common/BaseComponent';
import ErrorBoundary from '../common/ErrorBoundary';
import CombatDistance from './CombatDistance';
import CombatOperation from './CombatOperation';
import { CombatOperationState, CombatProps } from '../../types';
import { Stage } from '../../enum';
import selector from '../../selectors/combat';
import { dispatch } from '../../store';

const styles = require('./Combat.less');


const initialState: CombatOperationState = {
};

const initialProps = {
  stage: Stage.Create_0,
};

class CombatOperationArea extends BaseComponent<CombatProps, CombatOperationState> implements AbstractComponent<CombatProps, CombatOperationState> {
  displayName?: string = 'Combat';
  state: CombatOperationState = initialState;
  static defaultProps = initialProps;

  constructor(props: CombatProps) {
    super(props);
    this.bindInstance();
  }

  bindInstance(): void {
  }

  render(): ReactNode {
    return (
      <ErrorBoundary>
        <Row className={styles['combat-operation-area']}>
          <CombatDistance />
          <CombatOperation />
        </Row>
      </ErrorBoundary>
    );
  }
}

export default connect(selector)(CombatOperationArea);
