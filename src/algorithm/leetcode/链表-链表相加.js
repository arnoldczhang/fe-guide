/**
 * 题目：
 * 链表-链表相加
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
  const initial = l1.val + l2.val;
  const list = new ListNode(initial % 10);
  let next = list;
  const dp = (ll1, ll2, added = 0) => {
    if (ll1 || ll2 || added) {
      ll1 = ll1 || { val: 0 };
      ll2 = ll2 || { val: 0 };
      const val = ll1.val + ll2.val;
      next.next = new ListNode((val + added) % 10);
      next = next.next;
      dp(ll1.next, ll2.next, Math.floor((val + added) / 10));
    }
  };
  dp(l1.next, l2.next, Math.floor(initial / 10));
  return list;
};

console.log(addTwoNumbers(list1, list2));