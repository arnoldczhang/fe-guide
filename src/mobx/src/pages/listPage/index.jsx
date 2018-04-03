import React, { Component } from 'react';
import {
  autorun,
} from 'mobx';
import {
  inject,
  observer,
} from 'mobx-react';
import PropTypes from 'prop-types';

import ListBox from './ListBox.jsx';
import selector from '../../selectors/listPage';
import actions from '../../actions/listpage';
import bindAct from '../../bind';

const {
  string,
  number,
  oneOfType,
  object,
} = PropTypes;

const add = function _add() {
  const {
    title,
  } = this.props;
  console.log(222, title);
};

@inject(selector)
@bindAct(actions)
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
    console.log(1221);
    this.counter = this.counter.bind(this);
    autorun(add, this);
  }

  render() {
    const {
      title,
      list,
      indexStore,
    } = this.props;

    console.log(indexStore);

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
