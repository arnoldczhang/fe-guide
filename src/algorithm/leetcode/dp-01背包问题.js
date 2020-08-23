/**
 * 题目：
 * 
 * dp-01背包问题
 * 
 * 一个可装载重量为 W 的背包和 N 个物品，
 * 每个物品有重量和价值两个属性。其中第 i 个物品的重量为 wt[i]，
 * 价值为 val[i]，现在让你用这个背包装物品，最多能装的价值是多少？
 * 
 * 题解：
 * - 装进背包or不装进背包
 * - 如果不装的话，继承相同重量，数量 - 1的价值：dp[i - 1][w]
 * - 如果装的话，当前价值应该是去掉重量，数量 - 1的价值：dp[i - 1][w - wt[i - 1]] + val[i - 1]
 * 
 */
function bag(W, N, wt, val) {
  const dp = Array.from({ length: N + 1 }).fill(0);
  dp.forEach((item, index, array) => {
    array[index] = Array.from({ length: W + 1 }).fill(0);
  });

  for (let i = 1; i <= N; i++) {
    for (let w = 1; w <= W; w++) {
      if (w - wt[i-1] < 0) {
        // 当前背包容量装不下，只能选择不装入背包
        dp[i][w] = dp[i - 1][w];
      } else {
        // 装入或者不装入背包，择优
        dp[i][w] = Math.max(
          dp[i - 1][w - wt[i-1]] + val[i-1], 
          dp[i - 1][w],
        );
      }
    }
  }
  return dp[N][W];
}

console.log(bag(4, 3, [2, 1, 3], [4, 2, 3]));