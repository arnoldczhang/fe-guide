/**
 * 
 * 题目：
 * 
 * 给定一个整数数组 a，其中1 ≤ a[i] ≤ n （n为数组长度）, 
 * 其中有些元素出现两次而其他元素出现一次。
 * 【编程】 找到所有出现两次的元素。你可以不用到任何额外空间，
 * 并在O(n)时间复杂度内解决这个问题
 * 
 */

/**
 * 题解：
 * 
 * 由于 1 ≤ a[i] ≤ n，所以可以利用 a[i] - 1 索引，
 * 原地存储遇到变负后的数字，之后再次出现相同数字的话，
 * 存储的索引已经变为负数，即判为出现过
 * 
 */

function findDuplicates(nums) {
  const res = [];
  for (const num of nums) {
      const absNum = Math.abs(num);
      if (nums[absNum - 1] < 0) {
          res.push(absNum);
      } else {
          nums[absNum - 1] = -1 * nums[absNum - 1];
      }
  }
  return res;
};

findDuplicates([4,3,2,7,8,2,3,1]); // [2, 3]
