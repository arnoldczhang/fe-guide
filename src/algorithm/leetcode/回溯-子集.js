/**
 *78. 子集
 * 
 * 给定一组不含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）
 * 
 * 注：
 * 1. 解集不能包含重复的子集
 * 2. 要包含空集和本身
 * 
 * 示例 1：
 * 输入：nums = [1,2,3]
 * 输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 * 
 * 示例 2：
 * 输入：nums = [0]
 * 输出：[[],[0]]
 * 
 * 提示：
 * 1. 不需要used
 * 
 */

// test
console.log(subsets([1,2,3])); // [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
console.log(subsets([0])); // [[],[0]]

var subsets = function(nums) {
  const result = [];
  const len = nums.length;
  
  const backtrack = (n = 0, arr = []) => {
    if (n > len) return;
    result.push(arr.slice());
    for (let i = n; i < len; i += 1) {
      const num = nums[i];
      arr.push(num);
      backtrack(i + 1, arr);
      arr.pop();
    }
  }

  backtrack();
  return result;
};
