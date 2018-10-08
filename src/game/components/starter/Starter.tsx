import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col } from 'antd';

import ErrorBoundary from '../common/errorBoundary/ErrorBoundary';
import { StarterState, StarterProps } from '../../types';
import { Stage } from '../../enum';
import selector from '../../selectors/starter';

const {
  Header,
  Sider,
  Content,
  Footer,
} = Layout;
const styles = require('./Starter.less');

const initialState = {
};

const initialProps = {
  stage: Stage.create,
};


class Starter extends PureComponent<StarterProps, StarterState> {
  displayName?: string = 'Starter';
  state: StarterState = initialState;
  static defaultProps = initialProps;

  constructor(props: StarterProps) {
    super(props);
  }

  render() {
    return (
      <ErrorBoundary>
        <div className={styles.starter} key="Starter">
          <Row gutter={16}>
            <Col span={6} />
            <Col span={6} />
            <Col span={6} />
            <Col span={6} />
          </Row>
        </div>
      </ErrorBoundary>
    );
  }
}

export default connect(selector)(Starter);
