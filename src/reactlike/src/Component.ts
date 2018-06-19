export default class {

  props: Object;
  context: Object|null;

  constructor(props: Object, context: Object|null) {
    this.props = props;
    this.context = context;
  }

  shouldComponentUpdate(): boolean {
    return true;
  }

  componentDidMount(): void {

  }

  setState(state: Object, callback: Function|null): void {

  }

  render(): void {

  }
}