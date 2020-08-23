/**
 * 题目：
 * 优化-计数质数
 * 
 * [高效寻找质数](https://labuladong.gitbook.io/algo/gao-pin-mian-shi-xi-lie/da-yin-su-shu)
 * 
 * 统计所有小于非负整数 n 的质数的数量
 * 
 * 题解：
 * - 质数判定：如果n是质数，则n、n*2、n*3等都不是质数
 */
function countPrimes(n) {
  const isPrime = Array.from({ length: n }).fill(true);
  for (let i = 2; i * i < n; i += 1) {
    if (isPrime[i]) {
      for (let j = i * i; j < n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  return isPrime.slice(2).reduce((res, pre) => res + pre, 0);
}

console.log(countPrimes(10));