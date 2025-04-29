/**
 * 题目：
 * 
 * 回溯-子集
 * 
 * 给定一组不含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）
 * 
 * 注：
 * 1. 解集不能包含重复的子集
 * 2. 要包含空集和本身
 * 
 * 题解：
 * [1,2,3]的子集和，即为[1,2]的子集和，每个+3，以此类推
 * 
 */
var subsets = function(nums) {
  const len = nums.length;
  const result = [];

  const backtrack = (n = 0, arr = [], visited = {}) => {
    if (n > len) return;
    result.push([...arr]);
    for (let i = n; i < len; i += 1) {
      const item = nums[i];
      if (visited[item]) continue;
      arr.push(item);
      visited[item] = true;
      backtrack(i + 1, arr, visited);
      arr.pop();
      visited[item] = false;
    }
  };

  backtrack();
  return result;
};

console.log(subsets([1,2,3]));