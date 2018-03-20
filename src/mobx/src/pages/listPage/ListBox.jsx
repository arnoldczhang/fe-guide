import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const {
  object,
  oneOfType,
  number,
  string,
} = PropTypes;

class ListBox extends PureComponent {
  static propTypes = {
    content: oneOfType([object, string, number]),
  };

  static defaultProps = {
    content: {},
  };

  componentWillReceiveProps() {
  }

  render() {
    const {
      content,
    } = this.props;

    return (
      <li>
        <h2>{content}</h2>
      </li>
    );
  }
}

export default ListBox;
