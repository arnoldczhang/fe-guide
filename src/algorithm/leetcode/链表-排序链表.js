/**
 * 148. 排序链表
 * 
 * 给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。
 * 
 * 
 * 示例 1：
 * 输入：head = [4,2,1,3]
 * 输出：[1,2,3,4]
 * 
 * 示例 2：
 * 输入：head = [-1,5,3,4,0]
 * 输出：[-1,0,3,4,5]
 * 
 * 示例 3：
 * 输入：head = []
 * 输出：[]
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
 * 
 * 提示：
 * 1. 巨他妈难
 * 2. 归并排序 + 合并两个有序链表
 * 
 */
var sortList = function(head) {
  const merge = (h1, h2) => {
    const result = new ListNode(-1);
    let current = result;
    while (h1 && h2) {
      if (h1.val >= h2.val) {
        current.next = h2;
        h2 = h2.next;
      } else {
        current.next = h1;
        h1 = h1.next;
      }
      current = current.next;
    }
    current.next = h1 || h2;
    return result.next;
  };

  const mergeSort = (input) => {
    if (!input || !input.next) return input;
    let slow = input;
    let fast = slow.next;
    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }
    const rightHead = slow.next;
    // 断掉左右链接，分成相等长度的两部分
    slow.next = null;

    const left = mergeSort(input);
    const right = mergeSort(rightHead);
    return merge(left, right);
  }

  return mergeSort(head);
};