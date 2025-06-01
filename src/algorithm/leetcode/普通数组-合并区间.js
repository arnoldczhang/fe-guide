/**
 * 56. 合并区间
 * 
 * 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。
 * 
 * 
 * 示例 1：
 * 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
 * 输出：[[1,6],[8,10],[15,18]]
 * 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
 * 
 * 示例 2：
 * 输入：intervals = [[1,4],[4,5]]
 * 输出：[[1,5]]
 * 解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。
 * 
 * @param {number[][]} intervals
 * @return {number[][]}
 * 
 * 提示：
 * 1. 可以先排序
 * 2. 只要判定重合：start2 <= end1
 */

// test
console.log(merge([[1,3],[2,6],[8,10],[15,18]])); // [[1,6],[8,10],[15,18]]
console.log(merge([[1,4],[4,5]])); // [[1,5]]

var merge = function(intervals) {
  const result = [];
  const len = intervals.length;
  if (!len) return result;
  intervals.sort((pre, next) => pre[0] - next[0]);
  result.push(intervals[0]);
  for (let i = 1; i < len; i += 1) {
    const [start, end] = intervals[i];
    if (start <= result[result.length - 1][1]) {
      result[result.length - 1][1] = Math.max(end, result[result.length - 1][1]);
    } else {
      result.push([start, end]);
    }
  }
  return result;
};