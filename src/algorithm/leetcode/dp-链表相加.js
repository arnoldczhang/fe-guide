/**
 * 题目：
 * dp-链表相加
 * 
 * 给出两个 非空 的链表用来表示两个非负的整数。
 * 其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。
 * 如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。
 * 
 * 输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
 * 输出：(7 -> 0 -> 8)
 * 原因：342 + 465 = 807
 * 
 * 思路：
 * 1. 满10向后进位
 * 
 */
const LinkedList = require('../structure/链表.js');

const list1 = new LinkedList();
const list2 = new LinkedList();

list1.add(2);
list1.add(4);
list1.add(3);

list2.add(5);
list2.add(6);
list2.add(4);

// 循环解
function addTwoNumbers(l1, l2) {
  const result = new LinkedList(0);
  if (!l1) {
    l1 = new LinkedList(0);
  }

  if (!l2) {
    l2 = new LinkedList(0);
  }

  let curr = result;
  while (l1 || l2) {
    const sum = (l1 ? l1.value : 0) + (l2 ? l2.value : 0) + curr.value;
    curr.value = sum % 10;
    curr.next = new LinkedList(sum > 9 ? 1 : 0);
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
    curr = curr.next;
  }
  return result;
}

// dp解
function addTwoNumbers(l1, l2) {
  let sum = 0;
  const head = {};
  let cur = head;
  while(l1 || l2 || sum) {
    sum += (l1 && l1.val || 0) + (l2 && l2.val || 0);
    cur.next = new ListNode(sum % 10);
    l1 = l1 && l1.next;
    l2 = l2 && l2.next;
    cur = cur.next;
    sum = Math.floor(sum / 10);
  }
  return head.next;
};

console.log(addTwoNumbers({
  val: 2,
  next: {
    val: 4,
    next: {
      val: 3,
    },
  },
}, {
  val: 5,
  next: {
    val: 6,
    next: {
      val: 4,
    },
  },
}));