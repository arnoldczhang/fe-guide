const { HeapNode } = require('./base');

class Heap {
  constructor() {
    this.root = null;
  }

  match(v1, v2) { /**/ }

  add(value, parent = this.root) {
    const node = new HeapNode(value);
    if (!parent || !this.root) {
      this.root = node;
    } else if (this.match(parent, node)) {
      parent.child = node;
      node.parent = parent;
    }
  }
}

class MinHeap extends Heap {
  constructor() {
    super();
  }

  match(parent, target) {
    while (parent) {
      if (parent.value >= target.value) {
        return false;
      }
      parent = parent.parent;
    }
    return true;
  }
}

class MaxHeap extends Heap {
  constructor() {
    super();
  }

  match(parent, target) {
    while (parent) {
      if (parent.value <= target.value) {
        return false;
      }
      parent = parent.parent;
    }
    return true;
  }
}

exports.MinHeap = MinHeap;
exports.MaxHeap = MaxHeap;
