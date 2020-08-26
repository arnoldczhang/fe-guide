const { Node } = require('./base');

/**
 * LinkedList
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
class LinkedList {
  constructor(value) {
    this.head = null;
    this.tail = null;
    this.value = null;
    this.next = null;

    if (value !== undefined) {
      this.add(value);
    }
  }

  add(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.value = value;
    } else {
      if (!this.next) {
        this.next = node;
      }
      this.tail.next = node;
      this.tail = node;
    }
  }

  prepend(value) {
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
    this.value = value;
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

module.exports = LinkedList;
