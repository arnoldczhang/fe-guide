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
const reverse = (str = '', cach = []) => {
  const { length } = str;
  for (let i = 0; i < length; i += 1) {
    cach.push(str.substring(i, length));
  }
  return cach;
};

const transform = (str, match = []) => {
  const cach = [];
  for (let i = 0; i <= str.length; i += 1) {
    cach.push(...reverse(str.substring(0, i)));
  }
  return match.every((item) => cach.includes(item));
};


// test
console.log(transform('abcde', ['ab', 'cde'])); // true
console.log(transform('abcde', ['ab', 'cdde'])); // false