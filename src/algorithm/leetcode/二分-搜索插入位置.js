/**
 * 35. 搜索插入位置
 * 
 * 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
 * 请必须使用时间复杂度为 O(log n) 的算法。
 * 
 * 示例 1:
 * 输入: nums = [1,3,5,6], target = 5
 * 输出: 2
 * 
 * 示例 2:
 * 输入: nums = [1,3,5,6], target = 2
 * 输出: 1
 * 
 * 示例 3:
 * 输入: nums = [1,3,5,6], target = 7
 * 输出: 4
 * 
 * @param {*} nums 
 * @param {*} target 
 * @returns
 * 
 * 提示：
 * 1. 想好初始值，考虑边界情况（第一位）
 */

// test
console.log(searchInsert([1,3,5,6], 5)); // 2
console.log(searchInsert([1,3,5,6], 2)); // 1
console.log(searchInsert([1,3,5,6], 7)); // 4

var searchInsert = function(nums, target) {
  let result = nums.length;
  let start = 0;
  let end = result - 1;
  let mid;
  while (start <= end) {
    mid = start + ((end - start) / 2 >> 0);
    if (nums[mid] >= target) {
      result = mid;
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return result;
};