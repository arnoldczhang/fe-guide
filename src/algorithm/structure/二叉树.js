const { BinaryNode } = require('./base');

/**
 * 二叉搜索树
 *
 * 左子树各个值 < 节点值
 * 节点值 < 右子树各个值
 *
 * 空间复杂度
 * O(n)
 *
 * 时间复杂度
 * Access
 * O(log(n))
 * 
 * Search
 * O(log(n))
 * 
 * Insertion
 * O(log(n))
 * 
 * Deletion
 * O(log(n))
 * 
 */
class BinaryTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    if (!this.root) {
      this.root = new BinaryNode(value);
    } else {
      this.insertNode(this.root, value);
    }
  }

  insertNode(current, value) {
    const node = new BinaryNode(value);
    if (value === current.val) return false;
    if (value < current.val) {
      if (!current.left) {
        current.left = node;
      } else {
        this.insertNode(current.left, value)
      }
    } else {
      if (!current.right) {
        current.right = node;
      } else {
        this.insertNode(current.right, value) 
      }
    }
  }

  contains(root, value) {
    if (!root) return false;
    const { value: rootValue } = root;
    if (rootValue === value) {
      return true;
    }

    if (value < rootValue) {
      return this.contains(root.left, value);
    }
    return this.contains(root.right, value);
  }

  findNode(value, root = this.root) {
    if (!root || !this.contains(root, value)) return false;
    let next = root;
    while (next && next.val !== value) {
      if (value < next.val) {
        next = next.left;
      } else {
        next = next.right;
      }
    }
    return next ? next : false;
  }

  findParent(value, root = this.root) {
    if (!root || !this.contains(root, value)) return false;
    if (root.val === value) return null;
    if (root.val < value) {
      if (!root.right) return null;
      return root.right.val === value
        ? root
        : this.findParent(value, root.right);
    } else {
      if (!root.left) return null;
      return root.left.val === value
        ? root
        : this.findParent(value, root.left);
    }
  }

  remove(value) {

  }
}

module.exports = BinaryTree;
