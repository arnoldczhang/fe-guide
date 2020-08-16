/**
 * dp-凑零钱
 * 
 * 给你 k 种面值的硬币，面值分别为 c1, c2 ... ck，每种硬币的数量无限，
 * 再给一个总金额 amount，问你最少需要几枚硬币凑出这个金额，
 * 如果不可能凑出，算法返回 -1 
 * 
 * 题解：
 * 1. 明确 base case
 * > 最终金额为0说明有解，否则返回-1
 * 
 * 2. 明确「状态」，即原问题和子问题中会变化的变量
 * > amount
 * 
 * 3. 明确「选择」，即引起状态发生变化的变量
 * > coins
 * 
 * 4. 定义 dp 数组/函数的含义
 * > 最少硬币组合
 * 
 */
function coinChange(coins, amount) {
  const dp = (n, cach = {}) => {
    console.log('aa');
    // 如果超出金额范围，返回-1
    if (n < 0) return -1;
    // 如果金额正好减完
    if (n === 0) return 0;
    let res = Infinity;
    coins.forEach((coin) => {
      let sub;
      // 缓存计算次数
      if (cach[n - coin]) {
        sub = cach[n - coin];
      } else {
        cach[n - coin] = dp(n - coin, cach);
        sub = cach[n - coin];
      }
      // 如果超出金额范围，该子式无解
      if (sub === -1) return;
      // 计算最小的组合次数
      res = Math.min(res, sub + 1);
    });
    return res === Infinity ? -1 : res;
  };
  return dp(amount);
}

const coins = [1, 3, 5];
console.log(coinChange(coins, 11));
