class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

/**
 * LRU 缓存
 * 
 * 请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
 * 实现 LRUCache 类：
 * LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
 * int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
 * void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。
 * 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。
 * 
 * @param {number} capacity
 * 
 * 提示：
 * 1. 双向链表
 * 2. 书堆的逻辑，新书放最上面，放不下，抽掉最下面的
 */


// test
const lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
console.log(lRUCache.get(1));    // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
console.log(lRUCache.get(2));    // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
console.log(lRUCache.get(1));    // 返回 -1 (未找到)
console.log(lRUCache.get(3));    // 返回 3
console.log(lRUCache.get(4));    // 返回 4

var LRUCache = function(capacity) {
  this.capacity = capacity;
  this.cach = new Map();
  this.root = new Node();
  // pre指向最下面的书
  this.root.prev = this.root;
  // next指向最上面的书
  this.root.next = this.root;
};

LRUCache.prototype.pushFront = function(node) {
  node.prev = this.root;
  node.next = this.root.next;
  node.next.prev = node;
  node.prev.next = node;
};

LRUCache.prototype.removeBottom = function() {
  const bottom = this.root.prev;
  this.cach.delete(bottom.key);
  this.delete(bottom);
};

LRUCache.prototype.delete = function(node) {
  node.prev.next = node.next;
  node.next.prev = node.prev;
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  const node = this.getNode(key);
  return node ? node.value : -1;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  const node = this.getNode(key);
  if (node) {
    node.value = value;
  } else {
    const newNode = new Node(key, value);
    this.cach.set(key, newNode);
    this.pushFront(newNode);
    this.checkCapacity();
  }
};

LRUCache.prototype.checkCapacity = function() {
  if (this.cach.size > this.capacity) {
    this.removeBottom();
  }
};

LRUCache.prototype.getNode = function(key) {
  if (!this.cach.has(key)) return;
  const node = this.cach.get(key);
  this.delete(node);
  this.pushFront(node);
  return node;
};
