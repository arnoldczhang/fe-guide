/**
 * 3. 无重复字符的最长子串
 * 给定一个字符串，请你找出其中不含有重复字符的最长子串的长度。
 * 
 * 示例 1:
 * 输入: s = "abcabcbb"
 * 输出: 3 
 * 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 * 
 * 示例 2:
 * 输入: s = "bbbbb"
 * 输出: 1
 * 解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
 * 
 * 示例 3:
 * 输入: s = "pwwkew"
 * 输出: 3
 * 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
 * 请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
 * 
 * 提示：
 * 1. 缓存index
 */

// test
console.log(lengthOfLongestSubstring('abcabcbb'));
console.log(lengthOfLongestSubstring('bbbbb'));
console.log(lengthOfLongestSubstring('pwwkew'));


 function lengthOfLongestSubstring(s) {
  const { length } = s;
  let left = 0;
  let right = 0;
  let max = 0;
  const windowed = {};
  while (right < length) {
    const rv = s[right];
    right += 1;
    windowed[rv] = windowed[rv] || 0;
    windowed[rv] += 1;
    while (windowed[rv] > 1) {
      const lv = s[left];
      left += 1;
      windowed[lv] -= 1;
    }
    max = Math.max(max, right - left);
  }
  return max;
 }

const lengthOfLongestSubstring2 = (s) => {
  const cach = new Map();
  let result = 0;
  let left = 0;
  let right = 0;
  while (right < s.length) {
    const key = s[right];
    if (cach.has(key) && cach.get(key) >= left) {
      left = cach.get(key) + 1;
    }
    cach.set(key, right);
    result = Math.max(result, right - left + 1);
    right += 1;
  }
  return result;
}