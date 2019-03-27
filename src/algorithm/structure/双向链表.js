const { DoubleNode } = require('./base');

/**
 *DoubleLinkedList
 *
 *  * 空间复杂度
 * O(n)
 *
 * 时间复杂度
 * Access
 * O(n)
 * 
 * Search
 * O(n)
 * 
 * Insertion
 * O(1)
 * 
 * Deletion
 * O(1)
 * 
 */
class DoubleLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  add(value) {
    const node = new DoubleNode(value);
    if (this.head) {
      this.tail.next = node;
      node.pre = this.tail;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }
  }

  remove(value) {
    if (!this.head) return false;
    if (this.head.value === value) {
      if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
      } else {
        this.head.next.pre = null;
        this.head = this.head.next;
      }
      return true;
    } else {
      let next = this.head.next;
      while (next && next.value !== value) {
        next = next.next;
      }

      if (next) {
        if (next === this.tail) {
          next.pre.next = null;
          this.tail = next.pre;
        } else {
          next.pre.next = next.next;
          next.pre = next.pre;
        }
        return true;
      }
      return false;
    }
  }

  reverseTraversal(cb) {
    let pre = this.tail;
    while (pre) {
      cb(pre.value);
      pre = pre.pre;
    }
  }
}

module.exports = DoubleLinkedList;

// console.log(new upgradeNode('aa'))