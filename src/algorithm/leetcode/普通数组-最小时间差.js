/**
 * 539. 最小时间差
 * 
 * 给定一个 24 小时制（小时:分钟 "HH:MM"）的时间列表，找出列表中任意两个时间的最小时间差并以分钟数表示。
 * 示例 1：
 * 输入：timePoints = ["23:59","00:00"]
 * 输出：1
 * 
 * 示例 2：
 * 输入：timePoints = ["00:00","23:59","00:00"]
 * 输出：0
 * 
 * @param {string[]} timePoints
 * @return {number}
 * 
 * 提示：
 * 1. 排序 + 鸽巢原理
 * 
 */

// test
console.log(findMinDifference(["23:59","00:00"])); // 1
console.log(findMinDifference(["00:00","23:59","00:00"])); // 0

var getMinute = (t) => {
  const [hour, minute] = t.split(':');
  return hour * 60 - -minute;
}
var findMinDifference = function(timePoints) {
  if (timePoints.length > 24 * 60) return 0;
  timePoints.sort();
  let result = Infinity;
  let firstMinute = getMinute(timePoints[0]);
  let lastMinute = getMinute(timePoints[timePoints.length - 1])
  let preMinute = firstMinute;
  for (let i = 1; i < timePoints.length; i += 1) {
    const current = getMinute(timePoints[i]);
    result = Math.min(result, current - preMinute);
    preMinute = current;
  }
  result = Math.min(result, firstMinute + 24 * 60 - lastMinute);
  return result;
};