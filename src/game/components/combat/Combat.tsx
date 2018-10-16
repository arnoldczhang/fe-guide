import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
  Icon,
  Avatar,
} from 'antd';

import AbstractComponent from '../common/AbstractComponent';
import BaseComponent from '../common/BaseComponent';
import ErrorBoundary from '../common/ErrorBoundary';
import Clickable from '../common/Clickable';
import { CombatState, CombatProps } from '../../types';
import { Stage, CreateStep } from '../../enum';
import selector from '../../selectors/starter';
import { dispatch } from '../../store';

const styles = require('./Combat.less');

const ButtonGroup = Button.Group;

const initialState: CombatState = {
};

const initialProps = {
  stage: Stage.Create_0,
  stepIndex: CreateStep.Person,
};

class Combat extends BaseComponent<CombatProps, CombatState> implements AbstractComponent<CombatProps, CombatState> {
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
      <ErrorBoundary className={styles.combat}>
        <Row
          className={styles.combat}
          gutter={0}
        >
          <Row className={styles['combat-scene']}>
          </Row>
          <Row className={styles['combat-operation-area']}>
            <Row type={'flex'} justify={'center'} className={styles['combat-distance']}>
              <Col span={8} className={styles['distance-word']}>
                <ButtonGroup>
                  <Button type="primary">
                    <Icon type="left" />
                  </Button>
                  <Button>6.5</Button>
                  <Button type="primary">
                    <Icon type="right" />
                  </Button>
                </ButtonGroup>
              </Col>
              <Col span={8} className={styles['distance-word']}>6.1</Col>
              <Col span={8}></Col>
            </Row>
            <Row className={styles['combat-operation']}>
              <Col className={styles['combat-operation-col']} span={8}>
                <Clickable callback={this.handleClick}>
                  <Avatar className={styles['combat-operation-btn']} size={64} style={{ backgroundColor: '#87d068' }} icon="user" />
                </Clickable>
                <Avatar className={styles['combat-operation-btn']} size={64} style={{ backgroundColor: '#87d068' }} icon="user" />
                <Avatar className={styles['combat-operation-btn']} size={64} style={{ backgroundColor: '#87d068' }} icon="user" />
              </Col>
              <Col className={styles['combat-operation-col']} span={8}></Col>
              <Col className={styles['combat-operation-col']} span={8}></Col>
            </Row>
          </Row>
        </Row>
      </ErrorBoundary>
    );
  }
}

export default connect(selector)(Combat);
