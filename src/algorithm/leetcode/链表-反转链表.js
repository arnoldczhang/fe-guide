/**
 * 206. 反转链表
 * 
 * 给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
 * 
 * 示例 1：
 * 输入：head = [1,2,3,4,5]
 * 输出：[5,4,3,2,1]
 * 
 * 示例 2：
 * 输入：head = [1,2]
 * 输出：[2,1]
 * 
 * 示例 3：
 * 输入：head = []
 * 输出：[]
 * 
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  if (!head) return null;
  let temp = head;
  let result = new ListNode(temp.val, null);
  while (temp.next) {
    result = new ListNode(temp.next.val, result);
    temp = temp.next;
  }
  return result;
};