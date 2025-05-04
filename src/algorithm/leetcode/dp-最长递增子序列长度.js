/**
 * 300. 最长递增子序列
 * 给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
 * 子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。
 * 
 *  
 * 示例 1：
 * 输入：nums = [10,9,2,5,3,7,101,18]
 * 输出：4
 * 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
 * 
 * 示例 2：
 * 输入：nums = [0,1,0,3,2,3]
 * 输出：4
 * 
 * 示例 3：
 * 输入：nums = [7,7,7,7,7,7,7]
 * 输出：1
 */
var lengthOfLIS = function(nums) {
  const dp = Array(nums.length + 1).fill(1);
  for (let i = 0; i < nums.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  return Math.max(...dp);
};

// [二分查找解法](https://mp.weixin.qq.com/s?__biz=MzAxODQxMDM0Mw==&mid=2247484498&idx=1&sn=df58ef249c457dd50ea632f7c2e6e761&chksm=9bd7fa5aaca0734c29bcf7979146359f63f521e3060c2acbf57a4992c887aeebe2a9e4bd8a89&scene=21#wechat_redirect)
function findLIS2(nums) {
  const stack = [];
  nums.forEach((num) => {
    if (!stack.length) {
      stack.push([num]);
    } else {
      stack.some((res, index) => {
        if (num < res[res.length - 1]) {
          res.push(num);
          return true;
        }

        if (index === stack.length - 1) {
          stack.push([num]);
        }
        return false;
      });
    }
  });
  return stack.length;
}
console.log(findLIS([1,2,4,3,5,4,7,2]));
console.log(findLIS([2,2,2,2,2]));
