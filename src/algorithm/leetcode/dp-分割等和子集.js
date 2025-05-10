/**
 * 416. dp-分割等和子集.js
 * 
 * 给定一个只包含正整数的非空数组。
 * 是否可以将这个数组分割成两个子集，使得两个子集的元素和相等
 * 
 * 示例 1：
 * 输入：nums = [1,5,11,5]
 * 输出：true
 * 解释：数组可以分割成 [1, 5, 5] 和 [11] 。
 * 
 * 示例 2：
 * 输入：nums = [1,2,3,5]
 * 输出：false
 * 解释：数组不能分割成两个元素和相等的子集。
 * 
 * 提示：
 * 1. 部分数组的和是sum的一半
 * 2. dp[i]表示当sum=i时，能否用子集凑出来，true或false
 */

// test
console.log(canPartition([1, 5, 11, 5])); // true
console.log(canPartition([1, 2, 3, 5])); // false

var canPartition = function(nums) {
  const sum = nums.reduce((res, pre) => res + pre, 0);
  const half = sum / 2;
  if (sum % 2) return false;
  const len = nums.length;
  const dp = Array(half + 1).fill(false);
  dp[0] = true;
  for (let i = 0; i < len; i += 1) {
    const num = nums[i];
    for (let j = half; j >= num; j -= 1) {
      if (dp[half]) return true;
      dp[j] = dp[j] || dp[j - num];
    }
  }
  return dp[half];
};

function canPartition2(nums) {
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
