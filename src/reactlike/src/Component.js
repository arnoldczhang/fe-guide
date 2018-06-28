export default class {
    constructor(props, context, ...children) {
        this.props = props;
        this.context = context;
        this.children = children;
    }
    shouldComponentUpdate() {
        return true;
    }
    componentDidMount() {
    }
    setState(state, callback) {
    }
}
//# sourceMappingURL=Component.js.map