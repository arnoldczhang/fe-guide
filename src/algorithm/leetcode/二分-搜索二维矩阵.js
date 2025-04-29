/**
 * 给你一个满足下述两条属性的 m x n 整数矩阵：
 * - 每行中的整数从左到右按非严格递增顺序排列。
 * - 每行的第一个整数大于前一行的最后一个整数。
 * - 给你一个整数 target ，如果 target 在矩阵中，返回 true ；否则，返回 false 。
 * 
 * 输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
 * 输出：true
 * 
 * 输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
 * 输出：false
 * 
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

// test
console.log(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3));
console.log(searchMatrix([[1],[3]], 2));
console.log(searchMatrix([[1]], 1));