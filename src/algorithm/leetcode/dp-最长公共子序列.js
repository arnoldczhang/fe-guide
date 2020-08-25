/**
 * 题目：
 * dp-最长公共子序列
 * 
 * 一个字符串的 子序列 是指这样一个新的字符串：
 * 它是由原字符串在不改变字符的相对顺序的情况下，
 * 删除某些字符（也可以不删除任何字符）后组成的新字符串
 * 
 * 输入：text1 = "abcde", text2 = "ace" 
 * 输出：3
 * 
 * 输入：text1 = "abc", text2 = "abc"
 * 输出：3
 * 
 * 输入：text1 = "abc", text2 = "def"
 * 输出：0
 * 
 * 题解：
 * 
 */
// dp-table解
function longestCommonSubsequence(text1, text2) {
  const { length: l1 } = text1;
  const { length: l2 } = text2;
  const dp = Array.from({ length: l1 + 1 }).fill(0);
  dp.forEach((el, index) => {
    dp[index] = Array.from({ length: l2 + 1 }).fill(0);
  });
  for (let i = 1; i <= l1; i += 1) {
    for (let j = 1; j <= l2; j += 1) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(
          dp[i - 1][j],
          dp[i][j-1],
        );
      }
    }
  }
  return dp[l1][l2];
}

console.log(longestCommonSubsequence('abcde', 'ace'));