import React, { Component } from 'react';
// import {
//   action,
//   // computed,
// } from 'mobx';
import {
  inject,
  observer,
} from 'mobx-react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';

import selector from '../selectors/main';
import actions from '../actions/main';
import bindAct from '../bind';

const {
  number,
  object,
} = PropTypes;

const Loading = () => {
  return (
    <div>Loading...</div>
  );
};

// react-loadable
const LoadableComponent = Loadable({
  loader: () => import('../pages/listPage/index.jsx'),
  loading: Loading,
});

@inject(selector)
@bindAct(actions)
@observer
class App extends Component {
  static propTypes = {
    inited: number,
    indexStore: object,
  };

  static defaultProps = {
    inited: 0,
    indexStore: {},
  };

  constructor(props) {
    super(props);
    this.counter = this.counter.bind(this);
  }

  componentDidMount() {
  }

  async getData() {
    const {
      inited,
    } = this.props;
    console.log(inited);
    // const result = await fetch('https://takeaway.dianping.com/waimai/ajax/wxwallet/getweixinjsconfig');
    // console.log(inited, result);
  }

  // @action
  // counter() {
  //   const {
  //     indexStore,
  //   } = this.props;
  //   console.log(11221);
  //   indexStore.title = Math.random();
  // }

  render() {
    const {
      inited,
      indexStore: {
        mainTitle,
        title,
      },
    } = this.props;

    this.getData();

    if (inited) {
      return (
        <div>inted</div>
      );
    }

    return (
      <div>
        <div onClick={this.counter} onKeyDown={() => {}} >{mainTitle}</div>
        <LoadableComponent title={title} />
      </div>
    );
  }
}

export default App;
