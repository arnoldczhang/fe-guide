/**
 * Q1：给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合
 */
// const backtrace = (max = 1, count = 2, num = 1, result = [], cach = []) => {
//   for (; num <= max; num += 1) {
//     const current = cach.concat(num);
//     if (current.length === count) {
//       result.push(current);
//       continue;
//     }
//     backtrace(max, count, num + 1, result, current);
//   }
//   return result;
// };

// // test
// console.log(backtrace(5, 3));
// // [
// //   [ 1, 2, 3 ], [ 1, 2, 4 ],
// //   [ 1, 2, 5 ], [ 1, 3, 4 ],
// //   [ 1, 3, 5 ], [ 1, 4, 5 ],
// //   [ 2, 3, 4 ], [ 2, 3, 5 ],
// //   [ 2, 4, 5 ], [ 3, 4, 5 ]
// // ]
// console.log(backtrace(4, 2));
// // [ [ 1, 2 ], [ 1, 3 ], [ 1, 4 ], [ 2, 3 ], [ 2, 4 ], [ 3, 4 ] ]



/**
 * Q2：返回无重复数组内所有元素的可能组合
 */
// const backtrace = (arr = [], index = 0, result = [], cach = []) => {
//   const { length } = arr;
//   if (!length) return [];
//   for (; index < length; index += 1) {
//     const combination = [...cach, arr[index]];
//     result.push(combination);
//     backtrace(arr, index + 1, result, combination);
//   }
//   return result;
// };

// // test
// console.log(backtrace([1, 2, 3]));
// // [ [ 1 ], [ 1, 2 ], [ 1, 2, 3 ], [ 1, 3 ], [ 2 ], [ 2, 3 ], [ 3 ] ]



/**
 * Q3：返回无重复、顺序排序的数组的全排列组合
 */
// const backtrace = (arr = [], result = [], cach = [], length = arr.length) => {
//   for (let i = 0; i < arr.length; i += 1) {
//     const current = cach.concat(arr[i]);
//     if (current.length === length) {
//       result.push(current);
//       continue;
//     }
//     const newArr = arr.slice(0, i).concat(arr.slice(i + 1));
//     backtrace(newArr, result, current, length);
//   }
//   return result;
// };

// // test
// console.log(backtrace([1,2,3]));
// // [
// //   [ 1, 2, 3 ],
// //   [ 1, 3, 2 ],
// //   [ 2, 1, 3 ],
// //   [ 2, 3, 1 ],
// //   [ 3, 1, 2 ],
// //   [ 3, 2, 1 ]
// // ]



/**
 * Q4：返回有重复数组内所有元素的可能组合
 * 
 * - 思路：排序完，相邻的重复元素不重复push
 */
// const backtrace = (arr = [], result = [], start = 0, cach = []) => {
//   arr.sort((pre, next) => pre - next);
//   for(let index = start ; index < arr.length; index += 1) {
//     if (index > start && arr[index] === arr[index - 1]) {
//       backtrace(arr, result, index + 1, cach);
//       continue;
//     }
//     const current = cach.concat(arr[index]);
//     result.push(current);
//     backtrace(arr, result, index + 1, current);
//   }
//   return result;
// };

// // test
// console.log(backtrace([1, 2, 3, 2]));
// // [
// //   [ 1 ],       [ 1, 2 ],
// //   [ 1, 2, 2 ], [ 1, 2, 2, 3 ],
// //   [ 1, 2, 3 ], [ 1, 3 ],
// //   [ 1, 3 ],    [ 2 ],
// //   [ 2, 2 ],    [ 2, 2, 3 ],
// //   [ 2, 3 ],    [ 3 ],
// //   [ 3 ]
// // ]
// console.log(backtrace([1, 2, 2]));
// // [ [ 1 ], [ 1, 2 ], [ 1, 2, 2 ], [ 2 ], [ 2, 2 ] ]

/**
 * Q5：返回有重复数组内，元素和（不重复）为某个值的组合
 * 
 */
// const backtrace = (arr = [], sum = 0, result = [], cach = [], index = 0, count = 0) => {
//   arr.sort((pre, next) => pre - next);
//   for ( ;index < arr.length; index += 1) {
//     const tempSum = count + arr[index];
//     const current = cach.concat(arr[index]);
//     if (tempSum === sum) {
//       result.push(current);
//     } else if (tempSum < sum) {
//       backtrace(arr, sum, result, current, index + 1, tempSum);
//     }
//   }
//   return result;
// };

// // test
// console.log(backtrace([1, 2, 3, 4, 5], 6));
// // [
// //   [1, 2, 3],
// //   [1, 5],
// //   [2, 4],
// // ]