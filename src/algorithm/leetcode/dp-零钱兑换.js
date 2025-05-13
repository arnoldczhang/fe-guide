/**
 * 322. 零钱兑换
 * 
 * 给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
 * 计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。
 * 
 * 你可以认为每种硬币的数量是无限的。
 *  
 * 
 * 示例 1：
 * 输入：coins = [1, 2, 5], amount = 11
 * 输出：3 
 * 解释：11 = 5 + 5 + 1
 * 
 * 示例 2：
 * 输入：coins = [2], amount = 3
 * 输出：-1
 * 
 * 示例 3：
 * 输入：coins = [1], amount = 0
 * 输出：0
 * 
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 * 
 * 提示：
 * 1. dp[i]表示金额为i时需要的硬币数
 * 2. 求最小，那么默认Infinity
 */

// test
console.log(coinChange([1, 2, 5], 11)); // 3
console.log(coinChange([2], 3)); // -1
console.log(coinChange([1], 0)); // 0

var coinChange = function(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 0; i < coins.length; i += 1) {
    const coin = coins[i];
    for (let j = coin; j <= amount; j += 1) {
      dp[j] = Math.min(dp[j - coin] + 1, dp[j]);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
};

var coinChange2 = function(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i += 1) {
    for (let j = 0; j < coins.length; j += 1) {
      const coin = coins[j];
      if (i < coin) continue;
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[dp.length - 1] === Infinity ? - 1 : dp[dp.length - 1];
}