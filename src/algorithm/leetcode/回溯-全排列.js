/**
 * 46. 全排列
 * 
 * 给定一个 没有重复 数字的序列，返回其所有可能的全排列。
 * 
 * 示例 1：
 * 输入：nums = [1,2,3]
 * 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 * 
 * 示例 2：
 * 输入：nums = [0,1]
 * 输出：[[0,1],[1,0]]
 * 
 * 示例 3：
 * 输入：nums = [1]
 * 输出：[[1]]
 * 
 * @param {number[]} nums
 * @return {number[][]}
 */

// test
console.log(permute([1,2,3])); // [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
console.log(permute([0,1])); // [[0,1],[1,0]]
console.log(permute([1])); // [[1]]


var permute = function(nums) {
  const len = nums.length;
  const result = [];
  const backtrack = (n = 0, path = [], used = {}) => {
    if (n === len) {
      result.push([...path]);
      return;
    }
    for (var i = 0; i < len; i += 1) {
      const item = nums[i];
      if (used[item]) continue;
      path.push(item);
      used[item] = true;
      backtrack(n + 1, path, used);
      path.pop();
      used[item] = false;
    }
  };
  backtrack();
  return result;
};

// test
console.log(permute([1,2,3]));