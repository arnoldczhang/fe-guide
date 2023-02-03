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

  checkExisted(list, node = this.root) {
    const [first, ...other] = list;
    const existed = node.children.find(({ path }) => path === first);
    if (existed) {
      if (other.length) {
        return this.checkExisted(other, existed);
      }
      return [node, existed];
    }
    return -1;
  }

  create(path) {
    const pathList = path.split('/').filter(v => v);
    return this.iterateInsert(pathList);
  }

  delete(path) {
    const pathList = path.split('/').filter(v => v);
    const existed = this.checkExisted(pathList);
    if (existed !== -1) {
      const [parent, child] = existed;
      parent.children.splice(parent.children.indexOf(child), 1);
      return existed;
    }
    return false;
  }

  getValue(path) {
    const pathList = path.split('/').filter(v => v);
    const existed = this.checkExisted(pathList);
    if (existed) return existed[1].value;
    throw new Error('not existed');
  }
  
  setValue(path, value) {
    const node = this.create(path);
    node.value = value;
  }

  getRoot() {
    return this.root;
  }
}

// test
const zookeeper = new ZooKeeper();
zookeeper.create('/app/p_1/p_1_1');
zookeeper.create('/app/p_1/p_1_2');
zookeeper.delete('/app/p_1/p_1_2');
console.log(zookeeper.getValue('/app/p_1/p_1_1'));
zookeeper.setValue('/app/p_1/p_1_1', 100);
zookeeper.delete('/app/p_2');
zookeeper.delete('/app/p_2');
console.log(zookeeper.getValue('/app/p_1/p_1_1'));
console.log(JSON.stringify(zookeeper.getRoot(), null, 4));