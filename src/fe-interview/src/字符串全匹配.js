/**
 * 题目：
 * 
 * 给定一个字符串和一些字符组合的数组，用数组内的字符任意组合（可重复）可拼出
 * 字符串的话，就算true，否则false
 * 
 * 输入： leetcode，['leet', 'code']
 * 输出： true
 * 
 * 输入： abcdcccc，[‘ab', 'c', 'd']
 * 输出： true
 * 
 * 输入： abcd，[‘ab', 'ce', 'd']
 * 输出： false
 * 
 */
const transform = (str = '', arr = []) => {
  if (!str.length || !arr.length) return false;
  const dict = arr.reduce((res, pre) => {
    res[pre] = true;
    return res;
  }, {});
  let result = false;
  let left = 0;
  let right = 1;
  while (right <= str.length) {
    const tempStr = str.substring(left, right);
    if (tempStr in dict) {
      left = right;
      right = left + 1;
      result = true;
    } else {
      right += 1;
      result = false;
    }
  }
  return result;
};
console.log(transform('abcde', ['ab', 'cde'])); // true
console.log(transform('abcdef', ['ab', 'cde'])); // false
console.log(transform('abcde', ['ab', 'cdde'])); // false