/**
 * 回溯-组合
 * 
 * 给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合
 * 示例:
 * 输入: n = 4, k = 2
 * 输出:
 * [
 *  [2,4],
 *  [3,4],
 *  [2,3],
 *  [1,2],
 *  [1,3],
 *  [1,4],
 * ]
 * 
 * 题解：
 * 
 * 
 */
function combine(n, k) {
  const res = [];
  if (k > n || k < 0) return [];
  if (n === k) return [
    Array.from({ length: n }).fill(1).map((item, idx) => item + idx)
  ];
  const backtrack = (start, track = []) => {
    if (track.length === k) {
      return res.push(track);
    }
  
    for (let i = start; i <= n; i += 1) {
      track = track.concat(i);
      backtrack(i + 1, track.slice());
      track.pop();
    }
  };
  backtrack(1);
  return res;
};
console.log(combine(4, 2));