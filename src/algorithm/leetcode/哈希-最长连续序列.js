/**
 * 最长连续序列
 * 
 * 给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
 * 请你设计并实现时间复杂度为 O(n) 的算法解决此问题。
 *  
 * 
 * 示例 1：
 * 输入：nums = [100,4,200,1,3,2]
 * 输出：4
 * 解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
 * 
 * 示例 2：
 * 输入：nums = [0,3,7,2,5,8,4,6,0,1]
 * 输出：9
 * 
 * 示例 3：
 * 输入：nums = [1,0,1,2]
 * 输出：3
 * 
 * @param {number[]} nums
 * @return {number}
 * 
 * 提示：
 * 1. Set去重
 * 2. 有小取小
 * 
 */

// test
console.log(longestConsecutive([100,4,200,1,3,2]));
console.log(longestConsecutive([0,3,7,2,5,8,4,6,0,1]));
console.log(longestConsecutive([1,0,1,2]));

var longestConsecutive = function(nums) {
  const set = new Set(nums);
  let result = 0;
  for (const item of set) {
    // 重点！有小取小，避免重复遍历
    if (set.has(item - 1)) continue;
    let count = item;
    while (set.has(++count)) continue;
    result = Math.max(result, count - item);
  }
  return result;
};