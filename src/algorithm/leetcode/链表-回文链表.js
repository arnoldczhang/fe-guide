/**
 * 234. 回文链表
 * 
 * 给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。
 * 
 * 示例 1：
 * 输入：head = [1,2,2,1]
 * 输出：true
 * 
 * 示例 2：
 * 输入：head = [1,2]
 * 输出：false
 * 
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function(head) {
  const vals = [];
  while (head !== null) {
      vals.push(head.val);
      head = head.next;
  }
  for (let i = 0, j = vals.length - 1; i < j; ++i, --j) {
      if (vals[i] !== vals[j]) {
          return false;
      }
  }
  return true;
};