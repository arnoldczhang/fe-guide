declare const _default: {
    state: {
        num: number;
    };
    reducers: {
        increment(state: any, payload: any): any;
        incrementFail(state: any, payload: any): any;
    };
    effects: {
        incrementAsync(payload: any, rootState: any): Promise<void>;
    };
};
export default _default;
