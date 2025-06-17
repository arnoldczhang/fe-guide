/**
 * 204. 计数质数
 * 
 * 示例 1：
 * 输入：n = 10
 * 输出：4
 * 解释：小于 10 的质数一共有 4 个, 它们是 2, 3, 5, 7 。
 * 
 * 示例 2：
 * 输入：n = 0
 * 输出：0
 * 
 * 示例 3：
 * 输入：n = 1
 * 输出：0
 * 
 * @param {number} n
 * @return {number}
 * 
 * 提示：
 * 1. 埃氏筛：如果 x 是质数，那么大于 x 的 x 的倍数 2x,3x,… 一定不是质数
 * 
 */
var countPrimes = function(n) {
  let ans = 0;
  const isPrime = Array(n).fill(true);
  for (let i = 2; i < n; ++i) {
    if (isPrime[i]) {
      ans += 1;
      for (let j = i * i; j < n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  return ans;
};