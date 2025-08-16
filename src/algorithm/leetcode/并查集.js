/**
 * 图的动态连通性
 * 
 * - 思路类似在给定目录下搜索冗余文件（未被其他文件引用）
 */
class UF {
  constructor(count) {
    // 图映射（将查找复杂度降到O(1)）
    this.uf = {};
    // 连通分量
    this.count = count;
  }

  union(parent, node) {
    if (this.uf[node]) return;
    this.uf[node] = parent;
  }

  findParent(node) {
    let parent = this.uf[node];
    while (1) {
      if (typeof parent === 'undefined') {
        return node;
      }
      node = parent;
      parent = this.uf[node];
    }
  }

  isConnected(node1, node2) {
    return this.findParent(node1) === this.findParent(node2);
  }

  count() {
    return this.count - Object.keys(this.uf).length;
  }
}

// test
const uf = new UF(10);
uf.union(0, 1);
uf.union(1, 2);
uf.union(1, 3);
uf.union(4, 5);
console.log(uf.isConnected(0, 3)); // true
console.log(uf.isConnected(0, 5)); // false