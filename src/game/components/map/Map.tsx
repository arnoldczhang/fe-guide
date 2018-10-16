import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  Row,
  Col,
} from 'antd';

import AbstractComponent from '../common/AbstractComponent';
import BaseComponent from '../common/BaseComponent';
import ErrorBoundary from '../common/ErrorBoundary';
import { CombatState, CombatProps } from '../../types';
import { Stage, CreateStep } from '../../enum';
import selector from '../../selectors/starter';
import { dispatch } from '../../store';

const styles = require('./Map.less');

const initialState: CombatState = {
};

const initialProps = {
  stage: Stage.Create_0,
  stepIndex: CreateStep.Person,
};

class Map extends BaseComponent<CombatProps, CombatState> implements AbstractComponent<CombatProps, CombatState> {
  displayName?: string = 'Combat';
  state: CombatState = initialState;
  static defaultProps = initialProps;

  constructor(props: CombatProps) {
    super(props);
    this.bindInstance();
  }

  bindInstance(): void {
  }

  render(): ReactNode {
    return (
      <ErrorBoundary className={styles.combat}>
        <div>
          <Row gutter={8}>
          </Row>
          <Row gutter={8}>
            <Col></Col>
            <Col></Col>
          </Row>
        </div>
      </ErrorBoundary>
    );
  }
}

export default connect(selector)(Map);
