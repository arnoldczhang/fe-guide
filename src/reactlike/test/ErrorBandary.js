import { PureComponent } from 'react';
const initialProps = {};
const initialState = {
    error: null,
};
export default class Error extends PureComponent {
    constructor(props, options) {
        super(props, options);
        this.props = initialProps;
        this.state = initialState;
    }
    componentDidCatch(error, errorInfo) {
        console.log('error', error, errorInfo);
        this.setState({
            error,
        });
    }
    render() {
        const { error, } = this.state;
        if (error) {
            return React.createElement("div", null, "errrr");
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBandary.js.map