/**
 * 回溯-全排列
 * 
 * 给定一个 没有重复 数字的序列，返回其所有可能的全排列。
 * 
 * 示例:
 * 输入: [1,2,3]
 * 
 * 输出:
 * [
 *  [1,2,3],
 *  [1,3,2],
 *  [2,1,3],
 *  [2,3,1],
 *  [3,1,2],
 *  [3,2,1]
 * ]
 * 
 * 题解：
 * 
 */

 // 数学归纳
function permute(nums) {
  const res = [];
  const { length } = nums;
  if (length <= 1) return [nums];
  for (let i = 0; i < length; i += 1) {
    const el = nums[i];
    const rest = nums.slice(0, i).concat(nums.slice(i + 1));
    const restMute = permute(rest);
    for (let j = 0; j < restMute.length; j += 1) {
      res.push([el].concat(restMute[j]));
    }
  }
  return res;
};

// 回溯
function permute(nums) {
  const res = [];
  const { length } = nums;
  const backtrack = (track = []) => {
    if (track.length === length) {
      return res.push(track);
    }

    for (let i = 0; i < length; i += 1) {
      if (track.includes(nums[i])) {
        continue;
      }
      track.push(nums[i]);
      backtrack(track.slice());
      track.pop();
    }
  };
  backtrack();
  return res;
}
console.log(permute([1,2,3]));