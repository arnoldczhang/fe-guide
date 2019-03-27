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

exports.Node = Node;
exports.DoubleNode = DoubleNode;
exports.HeapNode = HeapNode;