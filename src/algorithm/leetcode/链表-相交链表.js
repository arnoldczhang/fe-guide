/**
 * 160. 相交链表
 * 
 * 给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。
 * 
 * 示例1：
 * listA = [4,1,8,4,5]
 * listB = [5,6,1,8,4,5]
 * Intersected at '8'
 * 
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 * 
 * 提示：
 * 1. 是比较node，不是比较node.val
 * 2. 相交 = 右对齐，由于不知道链表长度，比较 listA.length + listB.length 稳定出结果
 * 
 */

var getIntersectionNode = function(headA, headB) {
  let p = headA;
  let q = headB;

  while (p !== q) {
    p = p ? p.next : headB;
    q = q ? q.next : headA;
  }
  return p;
};