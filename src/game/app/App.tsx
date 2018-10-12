import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { AppState, AppProps } from '../types';
import { Stage } from '../enum';
import selector from '../selectors/app';
import Starter from '../components/starter/Starter';

const styles = require('./App.less');

const initialState = {
};

const initialProps = {
  stage: Stage.Create_0,
};


class App extends PureComponent<AppProps, AppState> {
  displayName?: string = 'App';
  state: AppState = initialState;
  static defaultProps = initialProps;

  constructor(props: AppProps) {
    super(props);
  }

  getStageNow() {
    const { stage } = this.props;
    switch (stage) {
      case Stage.Map:
        // return <Map />;
      case Stage.Create_0:
      case Stage.Create_1:
      case Stage.Create_2:
      default:
        return <Starter />;
    }
  }

  render() {
    return (
      <div className={styles.app} key="App">
        {this.getStageNow()}
      </div>
    );
  }
}

export default connect(selector)(App);
