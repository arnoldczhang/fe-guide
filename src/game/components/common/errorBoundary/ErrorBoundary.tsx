import React, { PureComponent } from 'react';

import { ErrorState, ErrorProps, ErrorInfo } from '../../../types';

const initialState = {
  hasError: false,
};

const initialProps = {
};

export default class ErrorBoundary extends PureComponent<ErrorProps, ErrorState> {
  displayName?: string = 'Starter';
  state: ErrorState = initialState;
  static defaultProps = initialProps;

  constructor(props: ErrorProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    this.setState({
      hasError: true,
    });
  }

  render(){
    if (this.state.hasError) {
      return (
        <div>Something went wrong!</div>
      );
    }
    return this.props.children;
  }
}
