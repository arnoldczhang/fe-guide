const mergeTwoLists = require('./递归-合并两个有序链表.js');

/**
 * 题目：
 * 归并-合并K个有序链表
 * 
 * 题解：
 * - 归并 + 递归
 */
function mergeKLists(lists) {
  if (!lists || !lists.length) return null;
  const { length } = lists;
  if (length === 1) return lists[0];
  if (length === 2) return mergeTwoLists(lists[0], lists[1]);
  const mid = length >> 1;
  return mergeTwoLists(
    mergeKLists(lists.slice(0, mid)),
    mergeKLists(lists.slice(mid)),
  );
}

console.log(mergeKLists({
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
