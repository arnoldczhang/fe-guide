import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Button,
} from 'antd';

import AbstractComponent from '../common/AbstractComponent';
import BaseComponent from '../common/BaseComponent';
import ErrorBoundary from '../common/ErrorBoundary';
import Man from '../common/Man';
import { CombatSceneState, CombatProps } from '../../types';
import { Stage, CreateStep } from '../../enum';
import selector from '../../selectors/combat';
import { dispatch } from '../../store';

const styles = require('./Combat.less');

const ButtonGroup = Button.Group;

const initialState: CombatSceneState = {
};

const initialProps = {
  stage: Stage.Create_0,
  stepIndex: CreateStep.Person,
};

class CombatScene extends BaseComponent<CombatProps, CombatSceneState> implements AbstractComponent<CombatProps, CombatSceneState> {
  displayName?: string = 'Combat';
  state: CombatSceneState = initialState;
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
    const { distance } = this.props;
    return (
      <ErrorBoundary>
        <Row className={styles['combat-scene']}>
          <Man dist={distance}/>
        </Row>
      </ErrorBoundary>
    );
  }
}

export default connect(selector)(CombatScene);
