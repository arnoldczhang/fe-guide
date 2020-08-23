/**
 * 题目：
 * dp-最长公共子序列
 * 
 * 题解：
 * 
 */
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