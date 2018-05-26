import React, { Component } from 'react';
// import {
//   action,
//   // computed,
// } from 'mobx';
import {
  inject,
  observer,
} from 'mobx-react';
import Hotkeys from 'react-hot-keys';
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
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
  }

  onKeyDown(e) {
    console.log(e, this.props);
  }

  async getData() {
    const {
      inited,
    } = this.props;
    console.log(inited);
    // const result = await fetch('https://takeaway.dianping.com/waimai/ajax/wxwallet/getweixinjsconfig');
    // console.log(inited, result);
  }

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
        <Hotkeys
          keyName="shift+a,alt+s"
          onKeyDown={this.onKeyDown}
        >
          <input type="text" />
        </Hotkeys>
        <div onClick={this.counter} onKeyDown={() => {}} >{mainTitle}</div>
        <LoadableComponent title={title} />
      </div>
    );
  }
}

export default App;
