/**
 * 题目：
 * 
 * dp-数组求最大子序和
 * 
 * 思路：
 * 动态规划
 * 
 */

// 链表解
function getSubArraySum(arr) {
  let maxSum = 0;
  let sum = 0;
  for (let i = 0; i < arr.length; i += 1) {
    const ch = arr[i];
    sum += ch;

    if (sum < ch) {
      sum = ch;
    }
    
    if (sum > maxSum) {
      maxSum = sum;
    }
  }
  return maxSum;
}

// dp解
function getSubArraySum(nums) {
  const dp = [];
    dp[0] = nums[0];
    for (let i = 1; i < nums.length; i += 1) {
        dp[i] = Math.max(nums[i], nums[i] + dp[i - 1]);
    }
    return Math.max(...dp);
}

// dp解
function getSubArraySum(nums) {
	const { length } = nums;
	const dp = (index = 0, sum = 0, max = 0) => {
		if (index >= length) return max;
		const val = nums[index];
		sum += val;
		if (sum < val) {
			return dp(index + 1, val, val);
		}
		return dp(index + 1, sum, Math.max(max, sum));
	};
	return dp(0);
}

console.log(getSubArraySum([-2, 6, -1, 5, 4, -7, 2, 3]));
console.log(getSubArraySum2([-2, 6, -1, 5, 4, -7, 2, 3]));
