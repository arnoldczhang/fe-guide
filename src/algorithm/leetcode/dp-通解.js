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

