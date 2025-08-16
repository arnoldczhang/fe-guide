/**
 * 70. 爬楼梯
 * 
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
 * 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 *  
 * 
 * 示例 1：
 * 输入：n = 2
 * 输出：2
 * 解释：有两种方法可以爬到楼顶。
 * 1. 1 阶 + 1 阶
 * 2. 2 阶
 * 
 * 示例 2：
 * 输入：n = 3
 * 输出：3
 * 解释：有三种方法可以爬到楼顶。
 * 1. 1 阶 + 1 阶 + 1 阶
 * 2. 1 阶 + 2 阶
 * 3. 2 阶 + 1 阶
 * 
 * @param {number} n
 * @return {number}
 * 
 * 提示：
 * 1. 因为只能走2阶，所以只要考虑上一阶和上上一阶过来的情况
 * 2. 因为两种情况互斥，所以是两者爬法的相加
 * 
 */

// test
console.log(climbStairs(2)); // 2
console.log(climbStairs(3)); // 3

var climbStairs = function(n) {
  const dp = [];
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i += 1) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};