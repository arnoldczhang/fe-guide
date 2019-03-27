const { Node } = require('./base');

/**
 * linkedList
 *
 * 空间复杂度
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
class linkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  add(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
  }

  prepend(value) {
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
  }

  contains(value) {
    while (this.head) {
      if (this.head.value === value) {
        return true;
      }
      this.head = this.head.next;
    }
    return false;
  }

  remove(value) {
    let head = this.head;
    if (head) {
      if (head.value === value) {
        if (head === this.tail) {
          this.head = null;
          this.tail = null;
        } else {
          this.head = this.head.next;
        }
        return true;
      } else {
        while (head.next && head.next.value !== value) {
          head = head.next;
        }

        if (head.next) {
          if (head.next === this.tail) {
            this.tail = head;
          }
          head.next = head.next.next;
          return true;
        }
        return false;
      }
    }
  }

  traverse(cb) {
    let node = this.head;
    while (node) {
      cb(node);
      node = node.next;
    }
  }

  reverseTraverse() {
    
  }
};

module.exports = linkedList;
