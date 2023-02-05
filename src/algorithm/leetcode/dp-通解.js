/**
 * Q1：斐波那契
 * 
 * - F(0) = 0，F(1) = 1
 * - F(n) = F(n - 1) + F(n - 2)，其中 n > 1
 */
// var fib = (sum = 0, cach = [0, 1]) => {
//   if (sum < 2) return cach[sum];
//   if (cach[sum]) return cach[sum];
//   cach[sum] = fib(sum - 1, cach) + fib(sum - 2, cach);
//   return cach[sum];
// };

// var fib2 = (sum = 0, cach = [0, 1]) => {
//   if (sum < 2) return cach[sum];
//   for (let i = 2; i <= sum; i += 1) {
//     cach[i] = cach[i - 1] + cach[i - 2];
//   }
//   return cach[sum];
// };



/**
 * Q2：换硬币
 */
// const coinChange = (coins = [], sum = 0) => {
//   if (!coins.length || sum < 0) return -1;
//   if (!sum) return 1;
//   const table = Array.from({ length: sum + 1 }).fill(Infinity);
//   table[0] = 0;

//   for (let i = 0; i <= sum; i += 1) {
//     for (let coin of coins) {
//       if (i - coin < 0) continue;
//       table[i] = Math.min(table[i], 1 + table[i - coin]);
//     }
//   }
//   return table[sum] === Infinity ? -1 : table[sum];
// };

// // test
// console.log(coinChange([1, 2, 5], 11)); // 3
// console.log(coinChange([1, 2, 5], 33)); // 8