/**
 * 两两交换链表中的节点
 * 
 * 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。
 * 
 * 
 * 示例 1：
 * 输入：head = [1,2,3,4]
 * 输出：[2,1,4,3]
 * 
 * 示例 2：
 * 输入：head = []
 * 输出：[]
 * 
 * 示例 3：
 * 输入：head = [1]
 * 输出：[1]
 * 
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var swapPairs = function(head) {
  if (!head) return null;
  let startNode = new ListNode(-1, head);
  let temp = startNode;
  let slow = temp.next
  let fast = slow.next;
  while (fast) {
    temp.next = fast;
    slow.next = fast.next;
    fast.next = slow;

    temp = slow;
    slow = slow.next;
    if (!slow) break;
    fast = slow.next;
  }
  return startNode.next;
};