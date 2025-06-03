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
 * 1. O(N)
 * 2. 缓存index
 */

// test
console.log(lengthOfLongestSubstring('abcabcbb')); // 3
console.log(lengthOfLongestSubstring('bbbbb')); // 1
console.log(lengthOfLongestSubstring('pwwkew')); // 3
console.log(lengthOfLongestSubstring(' ')); // 1
console.log(lengthOfLongestSubstring("abba")); // 2

/**
 * 缓存Set
 * @param {*} s 
 * @returns 
 */
function lengthOfLongestSubstring(s) {
  let result = 0;
  const cach = new Set();
  for (let left = 0, right = 0; right < s.length; right += 1) {
    while (cach.has(s[right])) {
      cach.delete(s[left++]);
    }
    cach.add(s[right]);
    result = Math.max(right - left + 1, result);
  }
  return result;
}

/**
 * 缓存Map
 * @param {*} s 
 * @returns 
 */
function lengthOfLongestSubstring1(s) {
  const cach = new Map();
  let max = 0;
  let start = 0;
  for (let i = 0; i < s.length; i += 1) {
    const letter = s[i];
    while (cach.has(letter)) {
      cach.delete(s[start++]);
    }
    cach.set(letter, i);
    max = Math.max(max, i - start + 1);
  }
  return max;
}

/**
 * 缓存Object
 * @param {*} s 
 * @returns 
 */
function lengthOfLongestSubstring2(s) {
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

const lengthOfLongestSubstring3 = (s) => {
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