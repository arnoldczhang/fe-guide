"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const connect_1 = require("./connect");
const app_selector_1 = require("./app-selector");
const PropTypes = require("prop-types");
const { number, object, } = PropTypes;
let App = class App extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.props = {};
        this.count = 1;
        console.log('app init');
    }
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
            React.createElement("div", null, "abc"),
            React.createElement("div", null, "abc"),
            React.createElement("div", null, "abc")
        ];
    }
};
App.propTypes = {
    num: number.isRequired,
    nummmm: number.isRequired,
    dispatch: object.isRequired,
};
App = __decorate([
    connect_1.connect(app_selector_1.default),
    __metadata("design:paramtypes", [Object, Object])
], App);
exports.default = App;
//# sourceMappingURL=App.js.map