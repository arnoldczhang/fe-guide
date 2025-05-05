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
 */
var isPalindrome = (s, left, right) => {
  while (left < right) {
    if (s[left++] !== s[right--]) return false;
  }
  return true;
}

var longestPalindrome2 = function(s) {
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
console.log(longestPalindrome('babad'));
console.log(longestPalindrome('aaa'));
