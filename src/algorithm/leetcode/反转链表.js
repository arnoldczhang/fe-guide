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
function reverseList(list) {
  var list = head;
  var p = list;
  var q= null;
  
  while(p.next !== null) {
      q = p.next;
      p.next = q.next;
      q.next = list;
      list = q;     
  }
  return list;
}