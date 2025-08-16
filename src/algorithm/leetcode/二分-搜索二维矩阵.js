/**
 * 74. 搜索二维矩阵
 * 
 * 给你一个满足下述两条属性的 m x n 整数矩阵：
 * - 每行中的整数从左到右按非严格递增顺序排列。
 * - 每行的第一个整数大于前一行的最后一个整数。
 * - 给你一个整数 target ，如果 target 在矩阵中，返回 true ；否则，返回 false 。
 * 
 * 示例 1：
 * 输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
 * 输出：true
 * 
 * 示例 2：
 * 输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
 * 输出：false
 * 
 * @param {*} matrix 
 * @param {*} target 
 * @returns 
 * 
 * 提示：
 * 1. 铺开搜
 */

// test
console.log(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3)); // true
console.log(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13)); // false
console.log(searchMatrix([[1],[3]], 2)); // false
console.log(searchMatrix([[1]], 1)); // true

/**
 * 不铺开，硬搜
 * @param {*} matrix 
 * @param {*} target 
 * @returns 
 */
var searchMatrix = function(matrix, target) {
  let result = false;
  let left = 0;
  const m = matrix.length;
  const n = matrix[0].length;
  let right = m * n - 1;
  let mid;
  let current;
  while (left <= right) {
    mid = left + ((right - left) >> 1);
    current = matrix[mid / n >> 0][mid % n]
    if (target < current) {
      right = mid - 1;
    } else if (target > current) {
      left = mid + 1;
    } else {
      return true;
    }
  }
  return result;
};

/**
 * 铺开搜
 * @param {*} matrix 
 * @param {*} target 
 * @returns 
 */
var searchMatrix2 = function(matrix, target) {
  const m = matrix.length;
  const list = [];
  for (let i = 0; i < m; i += 1) {
    list.push(...matrix[i]);
  }
  let start = 0;
  let end = list.length - 1;
  let mid;
  while (start <= end) {
    mid = start + ((end - start) >> 1);
    const num = list[mid];
    if (num === target) return true;
    if (num > target) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return false;
};
