/**
 * 15. 三数之和
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
 * 1. 不难
 * 2. 排序 + 固定一个数其他俩双指针 + 去重优化
 */

// test
console.log(threeSum([-1,0,1,2,-1,-4])); // [[-1,-1,2],[-1,0,1]]
console.log(threeSum([0,1,1])); // []
console.log(threeSum([0,0,0])); // [[0,0,0]]
console.log(threeSum([1,1,-2])); // [[1,1,-2]]

var threeSum = function(nums) {
  nums.sort((pre, next) => pre - next);
  const len = nums.length;
  if (len < 3) return [];
  const result = [];
  for (let i = 0; i < len - 1; i += 1) {
    // 跳过和之前相同的数字
    if (i && nums[i] === nums[i - 1]) continue;
    // 最小的三个数都>0，就没必要继续了
    if (nums[i] + nums[i + 1] + nums[i + 2] > 0) continue;
    // 当前值和最大的两个数相加都 < 0，说明当前值太小了，继续
    if (nums[i] + nums[len - 1] + nums[len - 2] < 0) continue;
    let temp = nums[i];
    let start = i + 1;
    let end = len - 1;
    while (start < end) {
      const sValue = nums[start];
      const eValue = nums[end];
      const sum = temp + sValue + eValue;
      if (!sum) {
        result.push([temp, sValue, eValue]);
        // 当前start对应的值，就不要再重复判断了
        while (start < len && sValue === nums[++start]) continue;
        // 当前end对应的值，就不要再重复判断了
        while (end > 0 && eValue === nums[--end]) continue;
      } else if (sum > 0) {
        end -= 1;
      } else {
        start += 1;
      }
    }
  }
  return result;
};

/**
 * 直觉写法
 * @param {*} nums 
 * @returns 
 */
var threeSum2 = function(nums) {
  nums.sort((pre, next) => pre - next);
  const result = [];
  const len = nums.length;
  if (!len || len < 3) return result;
  if (nums[0] > 0 || nums[len - 1] < 0) return result;
  for (let i = 0; i < len - 2; i += 1) {
    const num = nums[i];
    if (i && num === nums[i - 1]) continue;
    let start = i + 1;
    let end = len - 1;
    while (start < end) {
      let startN = nums[start];
      let endN = nums[end];
      if (num + startN > 0) break;
      const sum = num + startN + endN;
      if (sum === 0) {
        result.push([num, startN, endN]);
        while (startN === nums[++start]) ;
        while (endN === nums[--end]) ;
      } else if (sum < 0) {
        start += 1;
      } else {
        end -= 1;
      }
    }
  }
  return result;
}