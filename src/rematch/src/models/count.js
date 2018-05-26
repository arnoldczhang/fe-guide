export const count = {
  state: {
    numm: 0,
  },
  reducers: {
    increment(state, payload) {
      state.numm += payload;
      return Object.assign({}, state);
    }
  },
  effects: {
    async incrementAsync(payload, rootState) {
      await new Promise((resolve) => {
        setTimeout(() => {
          this.increment(payload);
          resolve();
        }, 2000);
      });
    },
  },
}