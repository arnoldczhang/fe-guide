/**
 * 题目：
 * 滑动窗口-无重复字符的最长子串
 * 
 * 给定一个字符串，请你找出其中不含有重复字符的最长子串的长度。
 * 
 * 输入: "abcabcbb"
 * 输出: 3 
 * 
 * 输入: "bbbbb"
 * 输出: 1
 * 
 * 题解：
 * - 两个相同字符间隔最远的距离，即为最长子串
 * - 简单计数器
 * 
 */
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

 console.log(lengthOfLongestSubstring('abcabcbb'));
 console.log(lengthOfLongestSubstring('bbbbb'));
 console.log(lengthOfLongestSubstring('pwwkew'));
