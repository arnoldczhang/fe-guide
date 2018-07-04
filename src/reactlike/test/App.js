var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import * as React from 'react';
import { connect } from './connect';
import selector from './app-selector';
const instanceArray = [];
let App = class App extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.props = {};
        this.count = 1;
        this.state = {
            name: 'arnold',
        };
        instanceArray.push(this);
        console.log('app init');
    }
    static getDerivedStateFromProps(props, state) {
        console.log('props', instanceArray, props);
    }
    ;
    componentDidMount() {
        const { dispatch, } = this.props;
        setTimeout(() => {
            dispatch.count.incrementAsync(this.count++);
        }, 2000);
    }
    render() {
        console.log('app render');
        const { num, nummmm, } = this.props;
        return [
            React.createElement("div", null, num),
            React.createElement("div", null, nummmm),
            React.createElement("div", null, this.state.name),
            React.createElement("div", null, "abc"),
            React.createElement("div", null, "abc")
        ];
    }
};
App = __decorate([
    connect(selector),
    __metadata("design:paramtypes", [Object, Object])
], App);
export default App;
//# sourceMappingURL=App.js.map