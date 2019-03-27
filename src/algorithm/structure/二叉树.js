const { BinaryNode } = require('./base');

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
    if (value < current.value) {
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
}

module.exports = BinaryTree;
