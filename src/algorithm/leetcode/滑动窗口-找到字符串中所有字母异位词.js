/**
 * 438. 找到字符串中所有字母异位词
 * 给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。
 *  
 * 
 * 示例 1:
 * 输入: s = "cbaebabacd", p = "abc"
 * 输出: [0,6]
 * 解释:
 * 起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
 * 起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。
 * 
  * 示例 2:
 * 输入: s = "abab", p = "ab"
 * 输出: [0,1,2]
 * 解释:
 * 起始索引等于 0 的子串是 "ab", 它是 "ab" 的异位词。
 * 起始索引等于 1 的子串是 "ba", 它是 "ab" 的异位词。
 * 起始索引等于 2 的子串是 "ab", 它是 "ab" 的异位词。
 * 
 * 提示：
 * 1. 计数
 */

// test
console.log(findAnagrams('abab', 'ab')); // [0, 1, 2]
console.log(findAnagrams('cbaebabacd', 'abc')); // [0, 6]

const getCode = (s) => s.charCodeAt(0) - 'a'.charCodeAt(0);

/**
 * 不定长窗口做法
 * 
 * - 相当于每个窗口只有一个字母
 * 
 * @param {*} s 
 * @param {*} p 
 * @returns 
 */
var findAnagrams = function(s, p) {
  const result = [];
  if (p.length > s.length) return result;
  const targetArr = Array.from({ length: 26 }).fill(0);
  for (const item of p) {
    targetArr[getCode(item)] += 1;
  }

  let left = 0;
  let right = 0;
  while (right < s.length) {
    // right进入窗口后，减一
    targetArr[getCode(s[right])] -= 1;

    // 多了
    while (targetArr[getCode(s[right])] < 0) {
      targetArr[getCode(s[left])] += 1;
      left += 1;
    }

    if (right - left + 1 === p.length) {
      result.push(left);
    }
    right += 1;
  }
  return result;
};

/**
 * 定长窗口
 * @param {*} s 
 * @param {*} p 
 * @returns 
 */
var findAnagrams2 = function(s, p) {
  const result = [];
  if (p.length > s.length) return result;
  const targetArr = Array.from({ length: 26 }).fill(0);
  const currentArr = Array.from({ length: 26 }).fill(0);
  let left = 0;
  let right = p.length - 1;

  const getCode = (s) => s.charCodeAt(0) - 'a'.charCodeAt(0);

  p.split('').forEach((item) => {
    targetArr[getCode(item)] += 1;
  });
  for (let i = left; i <= right; i += 1) {
    const item = s[i];
    currentArr[getCode(item)] += 1;
  }

  while (right < s.length) {
    if (currentArr.join() === targetArr.join()) {
      result.push(left);
    }
    if (right === s.length - 1) break;
    currentArr[getCode(s[left++])] -= 1;
    currentArr[getCode(s[++right])] += 1;
  }
  return result;
};