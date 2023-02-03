/**
 * 模拟zookeeper
 * 
 * - 按路径依次创建子路径，比如：
 *  /
 *    /app
 *      /app/p_1
 *        /app/p_1_1
 *        /app/p_1_2
 *      /app/p_2
 * 
 * - 实现几个方法：
 *  > create(path)
 *  > delete(path)
 *  > getValue(path)
 *  > setValue(path, value)
 */
class ZooKeeper {
  constructor() {
    this.root = this.createRoot();
  }

  createRoot() {
    return {
      path: '/',
      value: null,
      root: true,
      children: [],
      listener: {},
    };
  }

  createNode(path, value) {
   return {
    path,
    value,
    root: false,
    children: [],
    listener: {},
   } 
  }

  iterateInsert(list = [], node = this.root) {
    if (!list.length) return node;
    const [first, ...other] = list;
    const existed = node.children.find(({ path }) => path === first);

    if (existed) {
      return this.iterateInsert(other, existed);
    }

    const newNode = this.createNode(first);
    node.children.push(newNode);
    return this.iterateInsert(other, newNode);
  }

  iterateDelete(list, node = this.root) {
    const [first, ...other] = list;
    const existed = node.children.find(({ path }) => path === first);
    if (existed) {
      if (other.length) {
        return this.iterateDelete(other, existed);
      }
      node.children.splice(node.children.indexOf(existed), 1);
      return existed;
    }
    return -1;
  }

  create(path) {
    const pathList = path.split('/').filter(v => v);
    this.iterateInsert(pathList);
  }

  delete(path) {
    const pathList = path.split('/').filter(v => v);
    this.iterateDelete(pathList);
  }

  getValue(path) {

  }
  
  setValue(path, value) {

  }

  getRoot() {
    return this.root;
  }
}

// test
const zookeeper = new ZooKeeper();
zookeeper.create('/app/p_1/p_1_1');
zookeeper.create('/app/p_1/p_1_2');
zookeeper.delete('/app/p_1');
console.log(JSON.stringify(zookeeper.getRoot(), null, 4));