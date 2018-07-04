import React, { hydrate, Component } from '../src/react';
class App extends Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const { word = '', } = this.props;
        return (React.createElement("div", null, word));
    }
}
App.defaultProps = {
    word: '',
};
hydrate(React.createElement("div", null,
    React.createElement(App, { word: "aa" })), document.getElementById('root'));
//# sourceMappingURL=reactlike.js.map