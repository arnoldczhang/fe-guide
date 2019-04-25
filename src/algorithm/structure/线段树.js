const { SegmentNode } = require('./base');

/**
 * 线段树
 *
 * 参考：
 * 1. https://github.com/trekhleb/javascript-algorithms/tree/master/src/data-structures/tree/segment-tree
 * 2. http://www.cnblogs.com/shuaiwhu/archive/2012/04/22/2464583.html
 * 
 */
class SegmentTree {
  constructor(left, right) {
    if (right < left) {
      [left, right] = [right, left];
    }
    this.root = new SegmentNode(left, right);
    this.build();
  }

  build(node = this.root) {
    const { left: start, right: end } = node;
    if (start + 1 < end) {
      const mid = (start + end) >> 1;
      const leftChild = new SegmentNode(start, mid);
      const rightChild = new SegmentNode(mid, end);
      node.leftChild = leftChild;
      node.rightChild = rightChild;
      this.build(leftChild);
      this.build(rightChild);
    }
  }

  insert(left, right, root = this.root) {
    if (left <= root.left && root.right <= right) {
      root.cover += 1;
    } else {
      if (left <= (root.left + root.right) >> 1) {
        this.insert(left, right, root.leftChild);
      } else if ((root.left + root.right) >> 1 <= right) {
        this.insert(left, right, root.rightChild);
      }
    }
  }

  delete(left, right, root = this.root) {
    if (left <= root.left && root.right <= right) {
      root.cover -= 1;
    } else {
      if (left <= (root.left + root.right) >> 1) {
        this.insert(left, right, root.leftChild);
      } else if ((root.left + root.right) >> 1 <= right) {
        this.insert(left, right, root.rightChild);
      }
    }
  }
}

module.exports = SegmentTree;
