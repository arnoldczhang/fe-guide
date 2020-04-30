/**
 * 题目：
 * 
 * 将两个有序链表合并为一个新的有序链表并返回。
 * 新链表是通过拼接给定的两个链表的所有节点组成的。
 * 
 * 示例：
 * 
 * 输入：1->2->4, 1->3->4
 * 输出：1->1->2->3->4->4
 * 
 */
function combineList (l1, l2) {
  const result = new Node();
  if (!l1.head || !l2.head) {
    return result;
  }

  let lastNode = result;
  let [pre, next] = l1.head.value > l2.head.value
    ? [l2.head, l1.head]
    : [l1.head, l2.head];
  
  while (pre && next) {
    if (pre.value < next.value) {
      lastNode.next = pre;
      lastNode = pre;
      pre = pre.next;
    } else {
      lastNode.next = next;
      lastNode = next;
      next = next.next;
    }
  }

  lastNode.next = pre ? pre : next;
  return result.next;
}

// test
const LinkedList = require('../structure/链表.js');
const { Node } = require('../structure/base.js');

const list1 = new LinkedList();
list1.add(1);
list1.add(5);

const list2 = new LinkedList();
list2.add(2);
list2.add(5);
list2.add(6);
list2.add(8);

combineList(list1, list2);