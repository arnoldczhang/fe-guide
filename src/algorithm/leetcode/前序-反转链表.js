/**
 * 题目：
 * 前序-反转链表
 * 
 * 输入: 1->2->3->4->5->NULL
 * 输出: 5->4->3->2->1->NULL
 * 
 * 题解：
 * 
 * 
 */
function reverseList(head) {
  const reverse = (pre, cur) => {
    if (!cur) return pre;
    const tmp = cur.next;
    cur.next = pre;
    return reverse(cur, tmp);
  };
  return reverse(null, head);
}

console.log(reverseList({
  val: 1,
  next: {
    val: 2,
    next: {
      val: 3,
      next: {
        val: 4,
        next: null,
      },
    },
  },
}));