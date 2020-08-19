/**
 * dp-最长递增子序列长度
 * 
 * 输入: [10,9,2,5,3,7,101,18]
 * 
 * 输出: [2,3,7,101]
 * 
 * 题解：
 * - 子串是连续的，子序列可以不连续
 * 
 */

 // dp解
function findLIS(nums) {
  const { length } = nums;
  const dp = Array.from({ length }).fill(1);
  for (let i = 0; i < length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}

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

console.log(findLIS([1,3,5,4,7]));
console.log(findLIS([2,2,2,2,2]));
