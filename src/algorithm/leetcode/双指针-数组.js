/**
 * Q1：两数之和
 * 
 * @param {*} arr 
 * @param {*} sum 
 * @param {*} start 
 * @returns 
 */
// const twoSum = (arr = [], sum = 0, start = 0) => {
//   const { length } = arr;
//   if (!length) return [];
//   let end = length - 1;
//   while (start < end) {
//     const value = arr[start] + arr[end];
//     if (value === sum) return [arr[start], arr[end]];
//     if (value > sum) {
//       end -= 1;
//     } else {
//       start += 1;
//     }
//   }
//   return [];
// };



/**
 * Q2：三数之和
 * 
 * @param {*} arr 
 * @param {*} sum 
 * @returns 
 */
// const threeSum = (arr = [], sum = 0, index = 0) => {
//   const { length } = arr.sort((pre, next) => pre - next);
//   const result = [];
//   for ( ; index < length; index += 1) {
//     const twoResult = twoSum(arr, sum - arr[index], index + 1);
//     if (twoResult.length) result.push([arr[index], ...twoResult]);
//   }
//   return result;
// };



/**
 * Q3：n数之和
 * 
 * @param {*} arr 
 * @param {*} sum 
 * @param {*} n 
 * @param {*} index 
 * @returns 
 */
// const nSum = (arr = [], sum = 0, n = 2, index = 0) => {
//   const { length } = arr.sort((pre, next) => pre - next);
//   if (!length || length < n) return [];
//   if (n < 2) return [];
//   if (n === 2) return twoSum(arr, sum, index);
//   const result = [];
//   for ( ; index < length; index += 1) {
//     const otherResult = nSum(arr, sum - arr[index], n - 1, index + 1);
//     if (otherResult.length) result.push([arr[index], ...otherResult]);
//   }
//   return result;
// };

// // test
// console.log(twoSum([1, 4, 5, 6], 9));
// console.log(threeSum([-1, 0, 1, 2, -1, -4], 0));
// console.log(nSum([1, 4, 5, 6], 9));
// console.log(nSum([-1, 0, 1, 2, -1, -4], 0, 3));



