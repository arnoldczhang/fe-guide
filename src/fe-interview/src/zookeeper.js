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
class Zookeeper {
  constructor() {
    this.root = {
      path: '/',
      children: [],
      value: null,
    };
  }

  getRoot() {
    return this.root;
  }

  getChildPath(path) {
    return path.split(/\//).filter(Boolean);
  }

  getPathList(path) {
    return Array.isArray(path) ? path : this.getChildPath(path);
  }

  create(path, node = this.root) {
    const pathList = this.getPathList(path);
    while (pathList.length) {
      const tempPath = pathList.shift();
      let matched = node.children.find(({ path }) => path === tempPath);
      if (matched) {
        node = matched;
        continue;
      }

      matched = {
        path: tempPath,
        parent: node,
        children: [],
        value: null,
      };

      if (pathList.length) {
        this.create(pathList, matched);
      }
      node.children.push(matched);
      break;
    }
  }

  delete(path, node = this.root) {
    const pathList = this.getPathList(path);
    let index = -1;
    while (pathList.length) {
      const tempPath = pathList.shift();
      let matched = node.children.find(({ path }) => path === tempPath);
      if (matched) {
        index = node.children.findIndex(value => value === matched);
        node = matched;
        continue;
      }

      throw new Error(`${path} 不存在`);
    }
    node.parent.children.splice(index, 1);
    return node;
  }

  get(path, node = this.root) {
    const pathList = this.getPathList(path);
    while (pathList.length) {
      const tempPath = pathList.shift();
      let matched = node.children.find(({ path }) => path === tempPath);
      if (matched) {
        node = matched;
        continue;
      }

      throw new Error(`${path} 不存在`);
    }
    return node;
  }

  getValue(path) {
    return this.get(path).value;
  }

  setValue(path, value) {
    const node = this.get(path);
    node.value = value;
  }
}

// test
const zk = new Zookeeper();

zk.create('/app/p_1/p_1_1');
zk.delete('/app/p_1/p_1_1');
zk.create('/app/p_1/p_1_1');
zk.delete('/app/p_1/p_1_1');
zk.create('/app/p_1/p_1_1');
zk.create('/app/p_1/p_1_2');
zk.delete('/app/p_1/p_1_2');
console.log(zk.getValue('/app/p_1/p_1_1'));
zk.setValue('/app/p_1/p_1_1', 200);
zk.create('/app/p_2');
zk.setValue('/app/p_2', 100);
console.log(zk.getValue('/app/p_2'));
zk.delete('/app/p_2');
console.log(zk.getValue('/app/p_1/p_1_1'));
zk.setValue('/app/p_1/p_1_1', 300);
console.log(zk.getValue('/app/p_1/p_1_1'));
zk.delete('/app/p_2');