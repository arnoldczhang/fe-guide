import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
  Icon,
} from 'antd';

import AbstractComponent from '../common/AbstractComponent';
import BaseComponent from '../common/BaseComponent';
import { CombatProps, CombatDistanceState } from '../../types';
import selector from '../../selectors/combat';
import { Stage } from '../../enum';
import { dispatch } from '../../store';

const ButtonGroup = Button.Group;

const styles = require('./Combat.less');

const initialState: CombatDistanceState = {
};

const initialProps = {
  stage: Stage.Combat,
};

class CombatDistance extends BaseComponent<CombatProps, CombatDistanceState>
  implements AbstractComponent<CombatProps, CombatDistanceState> {
  displayName?: string = 'CombatDistance';
  state: CombatDistanceState = initialState;
  static defaultProps = initialProps;

  constructor(props: CombatProps) {
    super(props);
    this.bindInstance();
  }

  componentDidMount(): void {
    dispatch.combat.initDistance();
  }
 
  bindInstance(): void {
    this.minusCallback = this.minusCallback.bind(this);
    this.addCallback = this.addCallback.bind(this);
  }

  updateAsyncDistance(distance?: number) {
    dispatch.combat.updateAsyncDistance(distance);
  }

  minusCallback() {
    this.updateAsyncDistance(-0.1);
  }

  addCallback() {
    this.updateAsyncDistance(0.1);
  }

  render(): ReactNode {
    const {
      distance,
      nextDistance,
    } = this.props;
    return (
      <Row type={'flex'} justify={'center'} className={styles['combat-distance']}>
        <Col span={8} className={styles['distance-word']}>
          <ButtonGroup>
            <Button type="primary" onClick={this.minusCallback}>
              <Icon type="left" />
            </Button>
            <Button shape="circle" className={styles['distance-word-next']}>{nextDistance}</Button>
            <Button type="primary" onClick={this.addCallback}>
              <Icon type="right" />
            </Button>
          </ButtonGroup>
        </Col>
        <Col span={8} className={styles['distance-word']}>{distance}</Col>
        <Col span={8}></Col>
      </Row>
    );
  }
}

export default connect(selector)(CombatDistance);
