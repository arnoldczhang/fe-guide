import React, { PureComponent, ReactNode } from 'react';

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

  componentDidCatch(err: Error, info: ErrorInfo): void {
    this.setState({
      hasError: true,
    });
  }

  render(): ReactNode {
    const {
      className = '',
      children,
    } = this.props;
    if (this.state.hasError) {
      return (
        <div>Something went wrong!</div>
      );
    }
    return (
      <div className={className || ''}>
        {children}
      </div>
      );
  }
}
