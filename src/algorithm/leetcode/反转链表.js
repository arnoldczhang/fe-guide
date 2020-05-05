/**
 * 题目：
 * 
 * 1-2-3-4-5 变为 5-4-3-2-1
 * 
 * 题解：
 * 
 * 1-2-3-4-5
 * 2-1-3-4-5
 * 3-2-1-4-5
 * 4-3-2-1-5
 * 5-4-3-2-1
 * 
 */
function reverseList(head) {
  let list = head;
  let p = list;
  let q= null;
  if (p === null) {
    return null;
  }
  
  while(p.next !== null) {
    q = p.next;
    p.next = q.next;
    q.next = list;
    list = q;     
  }
  return list;
}

// test
const LinkedList = require('../structure/链表.js');
const list = new LinkedList();

list.add(1);
list.add(2);
list.add(3);
list.add(4);
list.add(5);

console.log(list.head);
console.log(reverseList(list.head));