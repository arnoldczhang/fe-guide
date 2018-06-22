"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initialState = {};
const initialReducer = {};
const mapState = (target, ...sources) => {
    sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
            target[key] = source[key].state;
        });
    });
};
const mapReducers = (target, ...sources) => {
    sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
            const reducers = source[key].reducers;
            target[key] = target[key] || {};
            Object.keys(reducers).forEach((reducerKey) => {
                target[key][reducerKey] = reducers[reducerKey];
            });
        });
    });
};
const mapEffects = (target, ...sources) => {
    sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
            const effects = source[key].effects;
            target[key] = target[key] || {};
            Object.keys(effects).forEach((effectKey) => {
                target[key][effectKey] = effects[effectKey].bind(target);
            });
        });
    });
};
const createStore = (state = initialState, reducers = initialReducer, effects = initialReducer) => ((data) => {
    mapState(state, data);
    mapReducers(reducers, data);
    mapEffects(effects, data);
    return {
        subscribe() {
        },
        dispatch() {
        },
        getState() {
            return state;
        },
    };
});
exports.default = createStore();
//# sourceMappingURL=createStore.js.map