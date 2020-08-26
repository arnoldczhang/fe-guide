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
  constructor(val = 0) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.child = null;
  }
}

class SegmentNode {
  constructor(left = 0, right = 0, cover = 0) {
    this.left = left;
    this.right = right;
    this.cover = cover;
    this.leftChild = null;
    this.rightChild = null;
  }
}

exports.Node = Node;
exports.DoubleNode = DoubleNode;
exports.HeapNode = HeapNode;
exports.BinaryNode = BinaryNode;
exports.TrieNode = TrieNode;
exports.SegmentNode = SegmentNode;
