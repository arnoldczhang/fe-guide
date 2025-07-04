/**
 * 34. 在排序数组中查找元素的第一个和最后一个位置
 * 
 * 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。
 * 如果数组中不存在目标值 target，返回 [-1, -1]。
 * 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。
 *  
 * 
 * 示例 1：
 * 输入：nums = [5,7,7,8,8,10], target = 8
 * 输出：[3,4]
 * 
 * 示例 2：
 * 输入：nums = [5,7,7,8,8,10], target = 6
 * 输出：[-1,-1]
 * 
 * 示例 3：
 * 输入：nums = [], target = 0
 * 输出：[-1,-1]
 * 
 * @param {*} nums 
 * @param {*} target 
 * @returns 
 */

// test
console.log(searchRange([5,7,7,8,8,10], 8)); // [3,4]
console.log(searchRange([5,7,7,8,8,10], 6)); // [-1,-1]
console.log(searchRange([], 0)); // [-1,-1]

var searchRange = function(nums, target) {
  let result = [-1, -1];
  let left = 0;
  let right = nums.length - 1;
  let mid;
  while (left <= right) {
    mid = left + ((right - left) >> 1);
    if (target === nums[mid]) {
      result = [mid, mid];
      let leftMid = mid - 1;
      let rightMid = mid + 1;
      while (target === nums[leftMid]) result[0] = leftMid--;
      while (target === nums[rightMid]) result[1] = rightMid++;
      return result;
    } else if (target < nums[mid]) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return result;
};

/**
 * 加了点边界条件判断
 * @param {*} nums 
 * @param {*} target 
 * @returns 
 */
var searchRange2 = function(nums, target) {
  let result = [-1, -1];
  let start = 0;
  let end = nums.length - 1;
  while (start <= end) {
    let mid = start + ((end - start) >> 1);
    if (nums[mid] === target) {
      start = mid;
      end = mid;
      while (start - 1 >= 0 && nums[start - 1] === target) start -= 1;
      while (end + 1 < nums.length && nums[end + 1] === target) end += 1;
      result = [start, end];
      return result;
    } else if (nums[mid] < target) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return result;
};
