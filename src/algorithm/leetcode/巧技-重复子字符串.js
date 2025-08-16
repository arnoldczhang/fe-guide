/**
 * 题目：
 * 巧技-重复子字符串
 * 
 */
function repeatedSubstringPattern(s) {
  let s1 = (s + s).slice(1, -1);
  return s1.indexOf(s) != -1;
}