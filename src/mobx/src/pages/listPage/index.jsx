import React, { Component } from 'react';
import {
  action,
  autorun,
} from 'mobx';
import {
  inject,
  observer,
} from 'mobx-react';
import PropTypes from 'prop-types';

import ListBox from './ListBox.jsx';
import selector from '../../selectors/listPage';

const {
  string,
  number,
  oneOfType,
  // array,
  object,
} = PropTypes;

const add = function _add() {
  const {
    title,
  } = this.props;
  console.log(222, title);
};

@inject(selector)
@observer
class ListPage extends Component {
  static propTypes = {
    title: oneOfType([string, number]),
    indexStore: object,
    list: object,
  };

  static defaultProps = {
    title: '',
    indexStore: {},
    list: {},
  };

  constructor(props) {
    super(props);
    this.counter = this.counter.bind(this);
    autorun(add, this);
  }

  @action
  counter() {
    const {
      indexStore,
    } = this.props;
    indexStore.mainTitle = Math.random();
  }

  render() {
    const {
      title,
      list,
    } = this.props;

    return (
      <div>
        <div onClick={this.counter} onKeyDown={() => {}} >{title}</div>
        <ul>
          {
            list.map(item => (<ListBox content={item} key={item} />))
          }
        </ul>
      </div>
    );
  }
}

export default ListPage;
