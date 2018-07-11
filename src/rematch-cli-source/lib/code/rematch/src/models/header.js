export default {
  state: {
    name: 'welcome to Rreact',
  },
  reducers: {
    changeTitle(state, payload) {
      console.log('changing...');
      state.name = payload;
      return Object.assign({}, state);
    },
    changeTitleStart(state) {
      console.log('start change...');
      return state;
    },
    changeTitleSuccess(state, payload) {
      console.log('change success....');
      state.name = payload;
      return Object.assign({}, state);
    },
    changeTitleFail(state) {
      console.log('change fail...');
      return state;
    },
  },
  effects: {
    async changeTitleAsync(payload, rootState) {
      this.changeTitleStart();
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            this.changeTitleSuccess(payload);
            resolve();
          } catch (err) {
            this.changeTitleFail(payload);
            reject();
          }
        }, 2000);
      });
    },
  },
};
