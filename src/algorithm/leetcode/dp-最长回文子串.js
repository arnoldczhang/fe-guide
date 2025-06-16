/**
 * 5. 最长回文子串
 * 
 * 示例 1：
 * 输入：s = "babad"
 * 输出："bab"
 * 解释："aba" 同样是符合题意的答案。
 * 
 * 示例 2：
 * 输入：s = "cbbd"
 * 输出："bb"
 * 
 * @param {string} s
 * @return {string}
 * 
 * 提示：
 * 1. 试试中心扩散法
 */

// test
console.log(longestPalindrome('babad')); // bab
console.log(longestPalindrome('cbbd')); // bb
console.log(longestPalindrome('aaa')); // aaa

var isPalindrome = (s, left, right) => {
  while (left < right) {
    if (s[left++] !== s[right--]) return false;
  }
  return true;
}

var longestPalindrome = function(s) {
  const len = s.length;
  const dp = Array(len);
  for (let i = 0; i < len; i += 1) {
    dp[i] = i ? dp[i - 1] : [0, 1];
    for (let j = 0; j <= i; j += 1) {
      if (isPalindrome(s, j, i)) {
        if (i - j + 1 > dp[i][1] - dp[i][0]) dp[i] = [j, i + 1];
        break;
      }
    }
  }
  return s.slice(dp[len - 1][0], dp[len - 1][1]);
};

/**
 * 直觉写法
 * @param {*} s 
 * @returns 
 */
var longestPalindrome2 = function(s) {
  const len = s.length;
  if (!len) return '';
  let result = s[0];
  for (let i = 0; i < len; i += 1) {
    for (let start = 0, end = i; start < end; ) {
      if (isPalindrome(s, start, end)) {
        if (end - start + 1 > result.length) {
          result = s.slice(start, end + 1);
        }
        break;
      }
      start += 1;
    }
  }
  return result;
}

/**
 * 中心扩散法
 * 
 * - 根据字符串长度（奇偶）不断往外扩散找
 * 
 * @param {*} s 
 * @returns 
 */
var longestPalindrome = function(s) {
  const len = s.length;
  if (!len) return '';
  var getString = (start, end) => {
    while (start >= 0 && end < len && s[start] === s[end]) {
      start -= 1;
      end += 1;
    }
    return s.slice(start + 1, end);
  };
  let res = s[0];
  for (let i = 0; i < len; i += 1) {
    // 奇数个数
    let res1 = getString(i, i);
    // 偶数个数
    let res2 = getString(i, i + 1);
    res = res1.length > res.length ? res1 : res;
    res = res2.length > res.length ? res2 : res;
  }
  return res;
}
