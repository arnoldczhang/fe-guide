/**
 * 题目：
 * 双向链表-LRU缓存机制
 * 
 * 运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制。
 * 它应该支持以下操作： 
 * - 获取数据 get 和 写入数据 put 。
 * - 获取数据 get(key) - 如果关键字 (key) 存在于缓存中，则获取关键字的值（总是正数），否则返回 -1。
 * - 写入数据 put(key, value) - 如果关键字已经存在，则变更其数据值；如果关键字不存在，则插入该组「关键字/值」。
 * - 当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。
 * 题解：
 * 
 */
class ListNode {
  constructor(key, value) {
      this.key = key
      this.value = value
      this.pre = null
      this.next = null
  }
}
class DoubleLinkedList {
  constructor() {
      this.head = new ListNode()
      this.tail = new ListNode()
      this.head.next = this.tail
      this.tail.pre = this.head
  }
  
  add(newNode) {
      // 处理下一个node
      newNode.next = this.head.next
      this.head.next.pre = newNode
      // 处理head
      this.head.next = newNode
      newNode.pre = this.head
  }

  removeTail() {
      const tailNode = this.tail.pre
      tailNode.pre.next = this.tail
      this.tail.pre = tailNode.pre
      return tailNode
  }

  moveToHead(node) {
      // 解除自己
      node.next.pre = node.pre
      node.pre.next = node.next
      node.pre = null
      node.next = null

      // 插入head
      node.next = this.head.next
      this.head.next.pre = node

      this.head.next = node
      node.pre = this.head
  }
}

class LRUCache {
  constructor(space) {
      this.space = space
      this.hashSet = {}
      this.doubleLinkedList = new DoubleLinkedList()
  } 

  get(key) {
      const node = this.hashSet[key]
      if (node) {
          this.doubleLinkedList.moveToHead(node)
          return node.value
      }
      return -1
  }

  put(key, value) {
      const node = this.hashSet[key]
      if (node) {
          this.doubleLinkedList.moveToHead(node)
          node.value = value
          return
      }

      const newNode = new ListNode(key, value)
      this.hashSet[key] = newNode
      this.doubleLinkedList.add(newNode)
      if (this.space) {
          this.space--
      } else {
          // 删除least recently used node
          const deleteNode = this.doubleLinkedList.removeTail()
          delete this.hashSet[deleteNode.key]
      }
  }
}
