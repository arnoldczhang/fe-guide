/**
 * 题目：
 * 递归-合并两个有序链表
 * 
 * 题解：
 * 
 */
function mergeTwoLists(l1, l2) {
  const prehead = new ListNode(-1);
  let prev = prehead;
  while (l1 != null && l2 != null) {
    if (l1.val <= l2.val) {
      prev.next = l1;
      l1 = l1.next;
    } else {
      prev.next = l2;
      l2 = l2.next;
    }
    prev = prev.next;
  }
  // 合并还未遍历的链表
  prev.next = l1 === null ? l2 : l1;
  return prehead.next;
}

console.log(mergeTwoLists({
  val: 1,
  next: {
    val: 2,
    next: {
      val: 4,
      next: null,
    },
  },
}, {
  val: 1,
  next: {
    val: 3,
    next: {
      val: 4,
      next: null,
    },
  },
}));
