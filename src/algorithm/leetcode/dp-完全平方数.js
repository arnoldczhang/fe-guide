/**
 * 279. 完全平方数
 * 
 * 给你一个整数 n ，返回 和为 n 的完全平方数的最少数量 。
 * 完全平方数 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。
 *  
 * 
 * 示例 1：
 * 输入：n = 12
 * 输出：3 
 * 解释：12 = 4 + 4 + 4
 * 
 * 示例 2：
 * 输入：n = 13
 * 输出：2
 * 解释：13 = 4 + 9
 * 
 * @param {number} n
 * @return {number}
 * 
 * 提示：
 * 1. 背包问题的变体
 * 2. dp[i]表示当前数字的最小完全平方数组合
 */

// test
console.log(numSquares(12)); // 3
console.log(numSquares(13)); // 2

var numSquares = function(n) {
  const dp = Array(n + 1).fill(Infinity);
  dp[0] = 0;
  dp[1] = 1;
  // 不断计算i的情况下最小的组合
  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j * j <= i; j += 1) {
      dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    }
  }
  return dp[n];
};

var numSquares2 = function(n) {
  const dp = [0];
  // 遍历完全平方数
  for (let i = 1; i * i <= n; i += 1) {
    // 求局部的最小组合，初始值是无限大
    for (let j = i * i; j <= n ; j += 1) {
      dp[j] = Math.min(dp[j - i * i] + 1, dp[j] || Infinity);
    }
  }
  return dp[n];
};