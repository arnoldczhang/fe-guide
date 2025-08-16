/**
 * 33. 搜索旋转排序数组
 * 
 * 整数数组 nums 按升序排列，数组中的值 互不相同 。
 * 在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。
 * 
 * 给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。
 * 
 * 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。
 * 
 * 示例 1：
 * 输入：nums = [4,5,6,7,0,1,2], target = 0
 * 输出：4
 * 
 * 示例 2：
 * 输入：nums = [4,5,6,7,0,1,2], target = 3
 * 输出：-1
 * 
 * 示例 3：
 * 输入：nums = [1], target = 0
 * 输出：-1
 * 
 * @param {*} nums 
 * @param {*} target 
 * @returns 
 * 
 * 提示：基于 target、nums[mid]、nums[end]确定查找区间
 * 
 */

// test
console.log(search([4,5,6,7,0,1,2], 0)); // 4
console.log(search([4,5,6,7,0,1,2], 3)); // -1
console.log(search([1], 0)); // -1

var search = function(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  const end = nums[right];
  let mid;
  while (left < right) {
    mid = left + ((right - left) >> 1);
    // 目标在mid的右侧，当前mid不在旋转区
    if (end < nums[mid] && target <= end) {
      left = mid + 1;
    // 目标在mid左侧，当前mid在旋转区
    } else if (target > end && nums[mid] <= end) {
      right = mid;
    } else {
      // 目标在mid同一部分
      if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
  }
  return nums[left] != target ? -1 : left;
};

/**
 * 直觉写法
 * 
 * @param {*} nums 
 * @param {*} target 
 * @returns 
 */
var search2 = function(nums, target) {
  const len = nums.length;
  let result = -1;
  let start = 0;
  let end = len - 1;
  let mid;
  const last = nums[nums.length - 1];
  while (start <= end) {
    mid = start + ((end - start) >> 1);
    if (target === nums[mid]) return mid;
    if (nums[mid] < last) {
      if (target <= last) {
        if (target > nums[mid]) {
          start = mid + 1;
        } else {
          end = mid - 1;
        }
      } else {
        end = mid - 1;
      }
    } else {
      if (target <= last) {
        start = mid + 1;
      } else {
        if (target > nums[mid]) {
          start = mid + 1;
        } else {
          end = mid - 1;
        }
      }
    }
  }
  return result;
};