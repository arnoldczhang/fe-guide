/**
 * 53. 最大子数组和
 * 
 * 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
 * 子数组是数组中的一个连续部分。
 *  
 * 
 * 示例 1：
 * 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
 * 输出：6
 * 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
 * 
 * 示例 2：
 * 输入：nums = [1]
 * 输出：1
 * 
 * 示例 3：
 * 输入：nums = [5,4,-1,7,8]
 * 输出：23
 * 
 * @param {number[]} nums
 * @return {number}
 * 
 * 提示：
 * 1. O(n)
 * 2. 记录之前序列的最大值pre和当前最大值max
 * 
 */

// test
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6
console.log(maxSubArray([1])); // 1
console.log(maxSubArray([5,4,-1,7,8])); // 23

var maxSubArray = function(nums) {
  if (!nums.length) return 0; 
  let pre = nums[0];
  let max = pre;
  for (let i = 1; i < nums.length; i += 1) {
    pre = Math.max(pre + nums[i], nums[i]);
    max = Math.max(max, pre);
  }
  return max;
};