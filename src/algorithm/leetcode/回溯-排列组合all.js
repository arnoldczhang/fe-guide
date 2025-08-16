/**
 * 子集/全排列/组合总和
 */

/**
 * Q1：子集（无重不可复选）
 * - 给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合
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
 * Q2：组合（无重不可复选）
 * - 返回无重复数组内所有元素的可能组合
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
 * Q3：全排列（无重不可复选）
 * - 返回无重复、顺序排序的数组的全排列组合
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
 * Q4：组合（有重不可复选）
 * - 返回有重复数组内所有元素的可能组合
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
 * Q5：组合总和（有重不可复选）
 * - 返回有重复数组内，元素和（不重复）为某个值的组合
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



/**
 * Q6：全排列（有重不可复选）
 * - 返回有重复的数组的全排列组合
 */
// const backtrace = (arr = [], result = [], cach = [], used = []) => {
//   arr.sort((pre, next) => pre - next);
//   for (let index = 0; index < arr.length; index += 1) {
//     if (used.includes(index)) continue;
//     // 相邻元素相同且已被用过，去重（used也可以，但是!used剪枝更多）
//     if (index > 0 && arr[index] === arr[index - 1] && !used.includes(index - 1)) {
//       continue;
//     }
//     const current = cach.concat(arr[index]);
//     if (current.length === arr.length) {
//       result.push(current);
//       continue;
//     }
//     backtrace(arr, result, current, used.concat(index));
//   }
//   return result;
// };

// // test
// console.log(backtrace([1, 2, 2]));
// // [ [ 1, 2, 2 ], [ 2, 1, 2 ], [ 2, 2, 1 ] ]



/**
 * Q7：组合总和（无重可复选）
 * - 返回无重复数组，元素和为目标值的所有组合（元素可重复）
 */
// const backtrace = (arr = [], sum = 0, result = []) => {
//   arr.sort((pre, next) => pre - next);

//   const iterate = (cach = [], cachSum = 0, index = 0) => {
//     for ( ; index < arr.length; index += 1) {
//       const nextSum = cachSum + arr[index];
//       if (nextSum > sum) {
//         continue;
//       }
  
//       const nextCach = cach.concat(arr[index]);
//       if (nextSum === sum) {
//         result.push(nextCach);
//         continue;
//       }
//       iterate(nextCach, nextSum, index);
//     }
//   };
  
//   iterate();
//   return result;
// };

// // test
// console.log(backtrace([1, 2, 3], 3));
// // [ [ 1, 1, 1 ], [ 1, 2 ], [ 3 ] ]
// console.log(backtrace([1, 2, 3], 6));
// // [
// //   [ 1, 1, 1, 1, 1, 1 ],
// //   [ 1, 1, 1, 1, 2 ],
// //   [ 1, 1, 1, 3 ],
// //   [ 1, 1, 2, 2 ],
// //   [ 1, 2, 3 ],
// //   [ 2, 2, 2 ],
// //   [ 3, 3 ]
// // ]



/**
 * Q8：全排列（无重可复选）
 * - 输入数组无重复元素，但每个元素可以被无限次使用
 */
// const backtrace = (arr = [], result = []) => {
//   const { length } = arr;
//   const iterator = (cach = []) => {
//     for (let i = 0; i < length; i += 1) {
//       const nextCach = cach.concat(arr[i]);
//       if (nextCach.length === length) {
//         result.push(nextCach);
//         continue;
//       }
//       iterator(nextCach);
//     }
//   };
//   iterator();
//   return result;
// };

// // test
// console.log(backtrace([1, 2, 3]));
// // [
// //   [ 1, 1, 1 ], [ 1, 1, 2 ], [ 1, 1, 3 ],
// //   [ 1, 2, 1 ], [ 1, 2, 2 ], [ 1, 2, 3 ],
// //   [ 1, 3, 1 ], [ 1, 3, 2 ], [ 1, 3, 3 ],
// //   [ 2, 1, 1 ], [ 2, 1, 2 ], [ 2, 1, 3 ],
// //   [ 2, 2, 1 ], [ 2, 2, 2 ], [ 2, 2, 3 ],
// //   [ 2, 3, 1 ], [ 2, 3, 2 ], [ 2, 3, 3 ],
// //   [ 3, 1, 1 ], [ 3, 1, 2 ], [ 3, 1, 3 ],
// //   [ 3, 2, 1 ], [ 3, 2, 2 ], [ 3, 2, 3 ],
// //   [ 3, 3, 1 ], [ 3, 3, 2 ], [ 3, 3, 3 ]
// // ]