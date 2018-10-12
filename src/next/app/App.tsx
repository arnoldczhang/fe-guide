import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Header from '../components/header/Header';
import selector from '../selectors/app';

const styles = require('./App.less');

class App extends PureComponent {

  render() {
    return (
      <div className={styles.App} key="App">
        <Header />
      </div>
    );
  }
}

export default connect(selector)(App);
