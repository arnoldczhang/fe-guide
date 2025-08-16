/**
 * 118. 杨辉三角
 * 
 * 给定一个非负整数 numRows，生成「杨辉三角」的前 numRows 行。
 * 在「杨辉三角」中，每个数是它左上方和右上方的数的和。
 *  
 * 
 * 示例 1:
 * 输入: numRows = 5
 * 输出: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
 * 
 * 示例 2:
 * 输入: numRows = 1
 * 输出: [[1]]
 * 
 * @param {number} numRows
 * @return {number[][]}
 * 
 * 提示：
 * 1. 第n行的数组有n个元素，首尾是1
 * 2. 第3行开始要计算上面行的和了
 */

// test
console.log(generate(5)); // [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
console.log(generate(1)); // [[1]]

var generate = function(numRows) {
  const dp = [];
  for (let i = 0; i < numRows; i += 1) {
    dp[i] = Array(i + 1);
    dp[i][0] = dp[i][i] = 1;
    for (let j = 1; j < i; j += 1) {
      dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
    }
  }
  return dp;
};

var generate2 = function(numRows) {
  if (!numRows) return [];
  const dp = [];
  dp[0] = [1];
  if (numRows === 1) return dp;
  dp[1] = [1, 1];
  if (numRows === 2) return dp;
  for (let i = 2; i < numRows; i += 1) {
    dp[i] = [];
    for (let slow = 0, fast = 1; fast < dp[i - 1].length; slow += 1, fast += 1) {
      dp[i][slow] = dp[i - 1][slow] + dp[i - 1][fast];
    }
    dp[i] = [1, ...dp[i], 1];
  }
  return dp;
};