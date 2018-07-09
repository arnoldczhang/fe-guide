import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import styles from './App.css';
import Header from '../components/header/Header.jsx';
import selector from '../selectors/app';

@connect(selector)
class App extends PureComponent {

  render() {
    return (
      <div className={styles.App} key="App">
        <Header />
      </div>
    );
  }
}

export default App;
