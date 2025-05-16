/**
 * 560. 和为 K 的子数组
 * 
 * 给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。
 * 子数组是数组中元素的连续非空序列。
 *  
 * 
 * 示例 1：
 * 输入：nums = [1,1,1], k = 2
 * 输出：2
 * 
 * 示例 2：
 * 输入：nums = [1,2,3, -1, 1, 1, 2], k = 3
 * 输出：2
 * 
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 * 
 * 提示：
 * 1. 前缀和s[i]
 * 2. s[i] - s[j] = k，序号i和序号j之间的差值是k
 */

// test
console.log(subarraySum([1,1,1], 2)); // 2
console.log(subarraySum([1,2,3, -1, 1, 1, 2], 3)); // 2

var subarraySum = function(nums, k) {
  let ans = 0, s = 0;
  const cnt = new Map();
  cnt.set(0, 1); // s[0]=0 单独统计
  for (const x of nums) {
    s += x;
    ans += cnt.get(s - k) ?? 0;
    cnt.set(s, (cnt.get(s) ?? 0) + 1);
  }
  return ans;
};