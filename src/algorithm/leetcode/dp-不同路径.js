/**
 * 62. 不同路径
 * 
 * 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
 * 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
 * 
 * 问总共有多少条不同的路径？
 * 
 * 示例 1：
 * 输入：m = 3, n = 7
 * 输出：28
 * 
 * 示例 2：
 * 输入：m = 3, n = 2
 * 输出：3
 * 解释：
 * 从左上角开始，总共有 3 条路径可以到达右下角。
 * 1. 向右 -> 向下 -> 向下
 * 2. 向下 -> 向下 -> 向右
 * 3. 向下 -> 向右 -> 向下
 * 
 * 示例 3：
 * 输入：m = 7, n = 3
 * 输出：28
 * 
 * 示例 4：
 * 输入：m = 3, n = 3
 * 输出：6
 * 
 * @param {number} m
 * @param {number} n
 * @return {number}
 * 
 * 提示：
 * 1. 斐波那契
 */

// test
console.log(uniquePaths(7, 3));
console.log(uniquePaths(3, 3));

var uniquePaths = function(m, n) {
  const dp = Array(m).fill(0).map((_, index) => {
    if (!index) return Array(n).fill(1);
    return Array(n).fill(0).map((_, index) => !index ? 1 : 0);
  });
  for (let i = 1; i < m; i += 1) {
    for (let j = 1; j < n; j += 1) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
};