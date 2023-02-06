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



/**
 * Q3：最长递增子序列
 * 
 * - 子序列：删除（或不删除）数组中的元素而不改变其余元素的顺序
 */
// const lengthOfLIS = (nums = []) => {
//   const table = Array.from({ length: nums.length }).fill(1);
//   for (let i = 0; i < nums.length - 1; i += 1) {
//     for (let j = i + 1; j < nums.length; j += 1) {
//       if (nums[j] > nums[i]) {
//         table[j] = Math.max(table[j], table[i] + 1);
//       }
//     }
//   }
//   return Math.max(...table);
// };

// // test
// console.log(lengthOfLIS([1,3,6,7,9,4,10,5,6])); // 6
// console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
// console.log(lengthOfLIS([0,1,0,3,2,3])); // 4
// console.log(lengthOfLIS([7,7,7,7,7,7,7])); // 1



/**
 * Q4：俄罗斯套娃问题
 * 
 * - 当另一个信封的宽度和高度都比这个信封大的时候，这个信封就可以放进另一个信封里，如同俄罗斯套娃一样。
 * - 请计算 最多能有多少个 信封能组成一组“俄罗斯套娃”信封（即可以把一个信封放到另一个信封里面）。
 */
// const maxEnvelopes = (envelopes = []) => {
//   // 按宽度升序排列，如果宽度一样，则按高度降序排列
//   envelopes.sort((e1, e2) => e1[0] !== e2[0] ? e1[0] - e2[0] : e2[1] - e1[1]);
//   const table = Array.from({ length: envelopes.length }).fill(1);
//   const height = envelopes.map(([, h]) => h);
//   for (let i = 0; i < height.length - 1; i += 1) {
//     for (let j = i + 1; j < height.length; j += 1) {
//       if (height[j] > height[i]) {
//         table[j] = Math.max(table[j], table[i] + 1);
//       }
//     }
//   }
//   return Math.max(...table);
// };

// // test
// console.log(maxEnvelopes([[5,4],[6,4],[6,7],[2,3]])); // 3
// console.log(maxEnvelopes([[4,5],[4,6],[6,7],[2,3],[1,1]])); // 4
// console.log(maxEnvelopes([[1,1],[1,1],[1,1]])); // 1



/**
 * Q5：最大子数组和
 * 
 * - 输入一个整数数组 nums，请你找在其中找一个和最大的子数组，返回这个子数组的和
 */
// const maxSubArray = (nums = []) => {
//   let result = Array.from({ length: nums.length }).fill(-Infinity);
//   result[0] = nums[0];
//   for (let i = 1; i < nums.length - 1; i += 1) {
//     result[i] = Math.max(nums[i], nums[i] + result[i - 1]);
//   }
//   return Math.max(...result);
// };

// // test
// console.log(maxSubArray([-3,1,3,-1,2,-4,2])); // 5



/**
 * Q6：最长公共子序列
 * 
 * https://mp.weixin.qq.com/s/ZhPEchewfc03xWv9VP3msg
 * 
 * - 字母顺序也要一致
 */

// // 自底向上
// const longestCommonSubsequence = (str1, str2) => {
//   const table = Array.from({ length: str1.length + 1 }).fill(
//     Array.from({ length: str2.length + 1 }).fill(0)
//   );

//   for (let i = 1; i <= str1.length; i += 1) {
//     for (let j = 1; j <= str2.length; j += 1) {
//       if (str1[i - 1] === str2[j - 1]) {
//         table[i][j] = table[i - 1][j - 1] + 1;
//       } else {
//         table[i][j] = Math.max(table[i][j - 1], table[i - 1][j]);
//       }
//     }
//   }
//   return table[str1.length][str2.length];
// };

// // 自顶向下
// const longestCommonSubsequence = (str1, str2) => {
//   const table = Array.from({ length: str1.length + 1 }).fill(
//     Array.from({ length: str2.length + 1 }).fill(0)
//   );

//   const dp = (i, j) => {
//     if (i >= str1.length || j >= str2.length) {
//       return 0;
//     }

//     if (table[i][j]) return table[i][j];

//     if (str1[i] === str2[j]) {
//       table[i][j] = 1 + dp(i + 1, j + 1);
//     } else {
//       table[i][j] = Math.max(
//         dp(i + 1, j),
//         dp(i, j + 1),
//       );
//     }
//     return table[i][j];
//   };
//   return dp(0, 0);
// };

// // test
// console.log(longestCommonSubsequence("zabcde", "acez")); // 3 -> ace



/**
 * Q7：两个字符串的删除操作
 * 
 * - 使两个字符串相同所需要的删除操作步数
 * - 即求两个字符串变成最长公共子序列最少步数
 */
// const minDistance = (str1 = '', str2 = '') => {
//   const step = longestCommonSubsequence(str1, str2);
//   return str1.length - step + str2.length - step;
// };
// console.log(minDistance('sea', 'ear')); // 2



/**
 * Q8：最小路径和
 */
