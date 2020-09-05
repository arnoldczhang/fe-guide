/**
 * 题目：
 * 回溯-数组中和为N的K元组
 * 
 * 题解：
 * 
 */
function getArrayCount(
  nums,
  target = 0, // 目标和
  count = 3, // 数量元组
) {
  const result = [];
  nums = nums.sort((pre, next) => pre - next);
  const backtrack = (arr, track = []) => {
    if (track.length === count) {
      const sum = track.reduce((res, pre) => res + pre, 0);
      if (sum === target) result.push(track);
      return;
    }
    for (let i = 0; i < arr.length; i += 1) {
      track.push(arr[i]);
      backtrack(arr.slice(i + 1), track.slice());
      track.pop();
    }
  };
  backtrack(nums);
  return result;
}

console.log(getArrayCount([-1, 0, 1, 2, -1, -4]));