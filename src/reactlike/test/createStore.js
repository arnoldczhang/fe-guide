const initialState = {};
const initialReducer = {};
const listeners = [];
const mapState = (target, ...sources) => {
    sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
            target[key] = source[key].state;
        });
    });
};
const mapReducers = (target, state, ...sources) => {
    sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
            const reducers = source[key].reducers;
            const childTarget = target[key] = target[key] || {};
            Object.keys(reducers).forEach((reducerKey) => {
                childTarget[reducerKey] = function reducerFunc(payload) {
                    let hasChanged = false;
                    const prevState = state[key];
                    const reducer = reducers[reducerKey].bind(childTarget, prevState);
                    const nextState = reducer(payload);
                    hasChanged = prevState !== nextState;
                    if (hasChanged) {
                        state[key] = nextState;
                        listeners.forEach((listener) => {
                            listener();
                        });
                    }
                };
            });
        });
    });
};
const mapEffects = (target, ...sources) => {
    sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
            const effects = source[key].effects;
            const childTarget = target[key] = target[key] || {};
            Object.keys(effects).forEach((effectKey) => {
                childTarget[effectKey] = effects[effectKey].bind(childTarget);
            });
        });
    });
};
const mapDispatcher = (dispatcher, ...args) => Object.assign(dispatcher, ...args);
const createStoreDefault = (state = initialState, reducers = initialReducer, effects = initialReducer) => ((data) => {
    const dispatcher = {};
    mapState(state, data);
    mapReducers(reducers, state, data);
    mapEffects(effects, data);
    mapDispatcher(dispatcher, effects, reducers);
    return {
        dispatch: dispatcher,
        subscribe() {
        },
        getState() {
            return state;
        },
    };
});
export const createStore = createStoreDefault();
export const subscribe = (listener) => {
    listeners.push(listener);
};
//# sourceMappingURL=createStore.js.map