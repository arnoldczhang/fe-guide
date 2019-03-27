/**
 * 
 */
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class DoubleNode extends Node {
  constructor(value) {
    super(value);
    this.pre = null;
  }
}

class HeapNode extends DoubleNode {
  constructor(value) {
    super(value);
    this.child = null;
    this.parent = null;
  }
}

class TrieNode extends HeapNode {
  constructor(value = '') {
    super(value);
    this.word = value;
    this.child = [];
  }
}

class BinaryNode {
  constructor(value = 0) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.child = null;
  }
}

exports.Node = Node;
exports.DoubleNode = DoubleNode;
exports.HeapNode = HeapNode;
exports.BinaryNode = BinaryNode;
exports.TrieNode = TrieNode;
