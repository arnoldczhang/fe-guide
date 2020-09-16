/**
 * 题目：
 * 哈希表-两个链表的第一个公共节点
 * 
 * 题解：
 * - 一条链表先走完
 * - 继续走另一条链表，发现之前存在过就说明是公共节点
 * 
 */
function getIntersectionNode(headA, headB) {
  const map = new Map();
  let node = headA;
  while (node) {
      map.set(node, node);
      node = node.next;
  }
  
  node = headB;
  while (node) {
      if (map.has(node)) return node;
      node = node.next;
  }
  return null;
};

console.log(getIntersectionNode({
  val: 4,
  next: {
    val: 1,
    next: {
      val: 8,
      next: {
        val: 4,
        next: {
          val: 4,
          next: null,
        },
      },
    },
  },
}, {
  val: 5,
  next: {
    val: 0,
    next: {
      val: 1,
      next: {
        val: 8,
        next: {
          val: 4,
          next: {
            val: 5,
            next: null,
          },
        },
      },
    },
  },
}));