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

 // 数学归纳法
function subsets(nums) {
  if (!nums.length) return [[]];
  const last = nums.pop();
  const res = subsets(nums);
  const { length } = res;
  for (let i = 0; i < length; i += 1) {
    res.push(res[i].concat(last));
  }
  return res;
}

// 回溯
function subsets(nums) {
  const { length } = nums;
  const res = [];
  const backtrack = (start, track = []) => {
    res.push(track);
    for (let i = start; i < length; i += 1) {
      track.push(nums[i]);
      backtrack(i + 1, track.slice());
      track.pop();
    }
  };
  backtrack(0);
  return res;
}

console.log(subsets([1,2,3]));