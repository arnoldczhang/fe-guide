import { PureComponent } from 'react';

export type Props = Partial<{

}>;

export type State = Partial<{
  error: any,
}>;

const initialProps = {

};

const initialState = {
  error: null,
};

export default class Error extends PureComponent<Props, State> {
  props: Props = initialProps;
  state: State = initialState;

  constructor(props: Props, options: Object) {
    super(props, options);
  }

  componentDidCatch(error, errorInfo) {
    console.log('error', error, errorInfo);
    this.setState({
      error,
    });
  }

  render() {
    const {
      error,
    } = this.state;
    if (error) {
      return <div>errrr</div>;
    }
    return this.props.children;
  }
}
