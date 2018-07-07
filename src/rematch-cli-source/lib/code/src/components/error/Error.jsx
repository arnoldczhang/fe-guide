import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const {
  array,
} = PropTypes;

class ErrorBoundary extends PureComponent {
  static propTypes = {
    children: array,
  };

  static defaultProps = {
    children: [],
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
