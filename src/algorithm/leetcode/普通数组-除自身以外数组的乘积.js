/**
 * 238. 除自身以外数组的乘积
 * 
 * 给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积 。
 * 题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。
 * 请 不要使用除法，且在 O(n) 时间复杂度内完成此题。
 *  
 * 
 * 示例 1:
 * 输入: nums = [1,2,3,4]
 * 输出: [24,12,8,6]
 * 
 * 示例 2:
 * 输入: nums = [-1,1,0,-3,3]
 * 输出: [0,0,9,0,0]
 * 
 * @param {number[]} nums
 * @return {number[]}
 * 
 * 提示：
 * 1. 分别计算每个index前和后所有数的乘积
 * 
 */

// test
console.log(productExceptSelf([1,2,3,4]));
console.log(productExceptSelf([-1,1,0,-3,3]));

var productExceptSelf = function(nums) {
  const len = nums.length;
  const result = new Array(len).fill(1);
  let initial = 1;
  result[len - 1] = initial;
  for (let i = len - 2; i >= 0; i -= 1) {
    result[i] = nums[i + 1] * result[i + 1];
  }
  for (let i = 0; i < len; i += 1) {
    result[i] *=  initial;
    initial *= nums[i];
  }
  return result;
};