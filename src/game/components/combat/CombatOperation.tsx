import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
} from 'antd';

import AbstractComponent from '../common/AbstractComponent';
import BaseComponent from '../common/BaseComponent';
import { CombatState, CombatProps, Weapon } from '../../types';
import selector from '../../selectors/combat';
import { dispatch } from '../../store';
import { Stage } from '../../enum';
import { eq, getBaseOperation } from '../../utils';
import Choice from '../common/Choice';

const styles = require('./Combat.less');

const initialState: CombatState = {
  weaponList: getBaseOperation(),
};

const initialProps = {
  stage: Stage.Combat,
};

class CombatOperation extends BaseComponent<CombatProps, CombatState>
  implements AbstractComponent<CombatProps, CombatState> {
  displayName?: string = 'CombatOperation';
  state: CombatState = initialState;
  static defaultProps = initialProps;

  constructor(props: CombatProps) {
    super(props);
    this.bindInstance();
  }

  bindInstance(): void {
    this.handleChoiceClick = this.handleChoiceClick.bind(this);
  }

  refreshWeaponState(cost: number) {
    dispatch.combat.refreshState(cost);
  }

  handleChoiceClick(outer: number, index: number, cost: number) {
    dispatch.combat.selectWeapon([outer, index]);
    this.setState({
      weaponList: this.state.weaponList,
    });
    this.refreshWeaponState(cost);
  }

  getBaseWeapon(): ReactNode[] {
    const { clickable, reloadIndex, selectedIndex } = this.props;
    const { weaponList } = this.state;
    return this.state.weaponList.map((list: Weapon[], outerIndex: number) => (
      <Col
        key={`choice_col_${outerIndex}`}
        className={styles['combat-operation-col']}
        span={8}
      >
        {
          list.map((weapon: Weapon, index: number) => (
            <Choice
              key={`choice_${index}`}
              clickable={clickable}
              reload={eq(reloadIndex[0], outerIndex) && eq(reloadIndex[1], index)}
              selected={eq(selectedIndex[0], outerIndex) && eq(selectedIndex[1], index)}
              item={weapon}
              callback={this.handleChoiceClick.bind(
                null,
                outerIndex,
                index,
                weaponList[selectedIndex[0]][selectedIndex[1]].cost
              )}
            />
          ))
        }
      </Col>
    ));
  }

  render(): ReactNode {
    return (
        <Row className={styles['combat-operation']}>
          {this.getBaseWeapon()}
        </Row>
    );
  }
}

export default connect(selector)(CombatOperation);
