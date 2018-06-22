export default {
  state: {
    num: 0,
  },
  reducers: {
    increment(state: any, payload: any) {
      state.num += payload;
      return (<any>Object).assign({}, state);
    },
  },
  effects: {
    async incrementAsync(payload: any, rootState: any) {
      await new Promise((resolve) => {
        setTimeout(() => {
          this.increment(payload);
          resolve();
        }, 2000);
      });
    },
  },
}
