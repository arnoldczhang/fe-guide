export default {
  counter() {
    const {
      indexStore,
      listPageStore,
    } = this.props;
    console.log(11221);
    // indexStore.title = Math.random();
    listPageStore.list = [3, 2, 1];
  },
};
