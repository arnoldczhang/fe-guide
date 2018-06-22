"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var default_1 = /** @class */ (function () {
    function default_1(props, context) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        this.props = props;
        this.context = context;
        this.children = children;
    }
    default_1.prototype.shouldComponentUpdate = function () {
        return true;
    };
    default_1.prototype.componentDidMount = function () {
    };
    default_1.prototype.setState = function (state, callback) {
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=Component.js.map