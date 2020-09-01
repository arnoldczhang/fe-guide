/**
 * 题目：
 * 双指针-最长回文子串
 * 
 * 题解：
 * - 从中心点向外扩展，left-- + right++
 * - 考虑奇偶两种情况
 * 
 */

// 双指针解
function longestPalindrome(s) {
  let result = s[0] || '';
  const { length } = s;
  for (let i = 0; i < length; i += 1) {
    for (let j = 1; j <= 2; j += 1) {
      let left = i;
      let right = i + j;
      while (left >= 0 && right < length && s[left] === s[right]) {
        left -= 1;
        right += 1;
      }

      const len = (right - 1 ) - (left + 1) + 1;
      if (len > result.length) {
        result = s.substr(left + 1, len);
      }
    }
  }
  return result;
}

/**
 * dp-table解
 * 
 * 状态
 * dp[i, j]: 表示s.substring(i, j)是否是回文
 * 
 * 选择
 * s[i] === s[j]: 表示是否可以继续扩张
 * dp[i + 1][j - 1]: 两边扩张后，是否还是回文
 * j - i < 2: 子串长度0或1的回文
 */
function longestPalindrome(s) {
  let res = '';
  const { length } = s;
  const dp = Array.from(new Array(length), () => new Array(length).fill(false));
  for (let i = length - 1; i >= 0; i -= 1) {
    for (let j = i; j < length; j += 1) {
      dp[i][j] = s[i] === s[j] && (j - i < 2 || dp[i + 1][j - 1]);
      if (dp[i][j] && j - i + 1 > res.length) {
        res = s.substring(i, j + 1);
      }
    }
  }
  return res;
}

console.log(longestPalindrome('babad'));
console.log(longestPalindrome('aaa'));
