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
    this.init();
  }

  init() {
    this.root = {
      name: '/',
      value: null,
      children: [],
    };
  }

  getPath(path = '') {
    return path.split('/');
  }

  create(path = '') {
    return this.getPath(path).reduce((res, path, index, array) => {
      if (path === '') return res.children;
      const matched = res.find(({ name }) => name === path);
      if (matched) return matched.children;
      const children = [];
      const pathStruct = {
        name: path,
        value: null,
        children,
      };
      res.push(pathStruct);
      if (index === array.length - 1) return pathStruct;
      return children;
    }, this.root);
  }

  delete(path = '') {
    return this.getPath(path).reduce((res, path, index, array) => {
      if (path === '') {
        if (array.length === 1) {
          return this.init();
        }
        return res.children;
      }
      const matched = res.find(({ name }) => name === path);
      if (!matched) throw new Error(`目录：${path}不存在，无法删除`);
      if (index === array.length - 1) {
        const matchedIndex = res.findIndex(({ name }) => name === path);
        res.splice(matchedIndex, 1);
        return res;
      }
      return matched.children;
    }, this.root);
  }

  get(path = '') {
    return this.getPath(path).reduce((res, path, index, array) => {
      if (path === '') return res.children;
      const matched = res.find(({ name }) => name === path);
      if (!matched) throw new Error(`目录：${path}不存在，无法获取值`);
      if (index === array.length - 1) return matched;
      return matched.children;
    }, this.root);
  }

  getValue(path = '') {
    return this.get(path).value;
  }

  setValue(path = '', value) {
    return this.get(path).value = value;
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