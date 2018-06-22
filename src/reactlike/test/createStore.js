"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initialState = {};
var initialReducer = {};
var mapState = function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        Object.keys(source).forEach(function (key) {
            target[key] = source[key].state;
        });
    });
};
var mapReducers = function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        Object.keys(source).forEach(function (key) {
            var reducers = source[key].reducers;
            target[key] = target[key] || {};
            Object.keys(reducers).forEach(function (reducerKey) {
                target[key][reducerKey] = reducers[reducerKey];
            });
        });
    });
};
var mapEffects = function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        Object.keys(source).forEach(function (key) {
            var effects = source[key].effects;
            target[key] = target[key] || {};
            Object.keys(effects).forEach(function (effectKey) {
                target[key][effectKey] = effects[effectKey].bind(target);
            });
        });
    });
};
var createStore = function (state, reducers, effects) {
    if (state === void 0) { state = initialState; }
    if (reducers === void 0) { reducers = initialReducer; }
    if (effects === void 0) { effects = initialReducer; }
    return (function (data) {
        mapState(state, data);
        mapReducers(reducers, data);
        mapEffects(effects, data);
        return {
            subscribe: function () {
            },
            dispatch: function () {
            },
            getState: function () {
                return state;
            },
        };
    });
};
exports.default = createStore();
//# sourceMappingURL=createStore.js.map