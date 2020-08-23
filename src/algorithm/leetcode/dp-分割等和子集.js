/**
 * 题目：
 * 
 * dp-分割等和子集.js
 * 
 * 给定一个只包含正整数的非空数组。
 * 是否可以将这个数组分割成两个子集，使得两个子集的元素和相等
 * 
 * 
 * 问题转化为：
 * 给定数组 nums，是否存在一个子数组，该子数组的和等于 nums 元素和的一半
 * 
 * 思路：
 * - 动态规划，时间复杂度O(n)
 * - 分为两个子集，各自总和都是sum / 2
 * 
 */
function canPartition(nums) {
  const { length } = nums;
  let sum = nums.reduce((res, pre) => res + pre, 0) / 2;
  if (sum % 1) return false;
  const dp = Array.from({ length: sum + 1 }).fill(false);
  dp[0] = true;
  for (let i = 0; i < length; i += 1) {
    const val = nums[i];
    for (let j = sum; j >= val; j -= 1) {
      if (dp[sum]) return true;
      dp[j] = dp[j] || dp[j - val];
    }
  }
  return dp[sum];
}

console.log(canPartition([1, 5, 11, 5]));