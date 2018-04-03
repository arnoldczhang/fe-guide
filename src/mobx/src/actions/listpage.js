export default {
  counter() {
    const {
      indexStore,
    } = this.props;
    console.log('list-action');
    indexStore.mainTitle = Math.random();
  },
};
