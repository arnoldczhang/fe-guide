/**
 * 题目：
 * 
 * 数组求最大子序和
 * 
 * 思路：
 * 动态规划
 * 
 */
function getSubArraySum(arr) {
  let sum = arr[0];
  let maxSum = arr[0];

  for (let i = 0; i < arr.length; i += 1) {
    const ch = arr[i];
    if (sum < 0) {
      sum = ch;
    } else {
      sum += ch;
    }

    if (sum > maxSum) {
      maxSum = sum;
    }
  }
  return maxSum;
}

function getSubArraySum2(arr) {
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

console.log(getSubArraySum([-2, 6, -1, 5, 4, -7, 2, 3]));
console.log(getSubArraySum2([-2, 6, -1, 5, 4, -7, 2, 3]));
