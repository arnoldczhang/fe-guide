/**
 * 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。
 * 如果数组中不存在目标值 target，返回 [-1, -1]。
 * 
 * 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。
 * 
 *  
 * 
 * 示例 1：
 * 
 * 输入：nums = [5,7,7,8,8,10], target = 8
 * 输出：[3,4]
 * 示例 2：
 * 
 * 输入：nums = [5,7,7,8,8,10], target = 6
 * 输出：[-1,-1]
 * 示例 3：
 * 
 * 输入：nums = [], target = 0
 * 输出：[-1,-1]
 * 
 * @param {*} nums 
 * @param {*} target 
 * @returns 
 */
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

// test
console.log(searchRange([5,7,7,8,8,10], 8)); // [3,4]