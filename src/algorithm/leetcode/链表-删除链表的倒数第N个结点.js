/**
 * 删除链表的倒数第 N 个结点
 * 
 * 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
 * 
 * 示例 1：
 * 输入：head = [1,2,3,4,5], n = 2
 * 输出：[1,2,3,5]
 * 
 * 示例 2：
 * 输入：head = [1], n = 1
 * 输出：[]
 * 
 * 示例 3：
 * 输入：head = [1,2], n = 1
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
 * @param {number} n
 * @return {ListNode}
 * 
 * 提示：
 * 可以试试快慢指针，快指针先走n步，再一起走
 */
var removeNthFromEnd = function(head, n) {
  const list = [];
  let temp = head;
  while (temp) {
    list.push(temp);
    temp = temp.next;
  }

  // 替换头节点
  if (list.length === n) {
    return list[list.length - n + 1] || null;
  }

  // 或替换头结点的next
  if (list.length - n - 1 >= 0) {
    list[list.length - n - 1].next = list[list.length - n + 1] || null;
    return head;
  }
  return null;
};