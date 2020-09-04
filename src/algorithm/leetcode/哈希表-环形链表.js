/**
 * 题目：
 * 
 * 给定一个链表，判断链表中是否有环。
 * 为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。
 * 如果 pos 是 -1，则在该链表中没有环。
 * 
 * 题解：
 * - 不能仅判断节点的val是否相等，要判断节点是否完全一致
 * 
 */
function hasCycle(head) {
  if(!head || !head.next) return false
  let map = new Map()
  while (head) {
    if (map.has(head)) return true
    map.set(head, true)
    head = head.next
  }
  return false;
}

console.log(hasCycle({
  val: 3,
  next: {
    val: 2,
    next: {
      val: 0,
      next: {
        val: -4,
        next: null,
      },
    },
  },
}));
