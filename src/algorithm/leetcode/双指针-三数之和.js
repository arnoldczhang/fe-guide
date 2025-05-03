/**
 * 三数之和
 * 
 * 给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请你返回所有和为 0 且不重复的三元组。
 * 注意：答案中不可以包含重复的三元组。
 * 
 *  
 * 示例 1：
 * 输入：nums = [-1,0,1,2,-1,-4]
 * 输出：[[-1,-1,2],[-1,0,1]]
 * 解释：
 * nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
 * nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
 * nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
 * 不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
 * 注意，输出的顺序和三元组的顺序并不重要。
 * 
 * 示例 2：
 * 输入：nums = [0,1,1]
 * 输出：[]
 * 解释：唯一可能的三元组和不为 0 。
 * 
 * 示例 3：
 * 输入：nums = [0,0,0]
 * 输出：[[0,0,0]]
 * 解释：唯一可能的三元组和为 0 。
 * 
 * @param {number[]} nums
 * @return {number[][]}
 * 
 * 提示：
 * 1. 巨难
 * 2. 排序 + 双指针
 */
var threeSum = function(nums) {
  const len = nums.length;
  if (len < 3) return [];
  const result = [];
  // 排序：小 -> 大
  nums.sort((a, b) => a - b);
  for (let i = 0; i < len - 2; i += 1) {
    const temp = nums[i];
    // 跳过和之前相同的数字
    if (i > 0 && temp === nums[i - 1]) continue;
    // 最小的三个数都>0，就没必要继续了
    if (temp + nums[i + 1] + + nums[i + 2] > 0) break;
    // 当前值和最大的两个数相加都 < 0，说明当前值太小了，继续
    if (temp + nums[len - 2] + nums[len - 1] < 0) continue;

    // 反向双指针开始
    let start = i + 1;
    let end = len - 1;
    while (start < end) {
      const sum = temp + nums[start] + nums[end];
      if (sum > 0) {
        end -= 1;
      } else if (sum < 0) {
        start += 1;
      } else {
        result.push([temp, nums[start], nums[end]]);
        // 当前start对应的值，就不要再重复判断了
        for (start++; start < end && nums[start] === nums[start - 1]; start++);
        // 当前end对应的值，就不要再重复判断了
        for (end--; start < end && nums[end] === nums[end + 1]; end--);
      }
    }
  }
  return result;
};