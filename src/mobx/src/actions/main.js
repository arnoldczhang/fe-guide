export default {
  counter() {
    const {
      indexStore,
    } = this.props;
    console.log(11221);
    indexStore.title = Math.random();
  },
};
