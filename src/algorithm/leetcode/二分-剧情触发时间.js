/**
 * LCP 08. 剧情触发时间
 * 
 * 在战略游戏中，玩家往往需要发展自己的势力来触发各种新的剧情。一个势力的主要属性有三种，分别是文明等级（C），资源储备（R）以及人口数量（H）。在游戏开始时（第 0 天），三种属性的值均为 0。
 * 随着游戏进程的进行，每一天玩家的三种属性都会对应增加，我们用一个二维数组 increase 来表示每天的增加情况。这个二维数组的每个元素是一个长度为 3 的一维数组，例如 [[1,2,1],[3,4,2]] 表示第一天三种属性分别增加 1,2,1 而第二天分别增加 3,4,2。
 * 所有剧情的触发条件也用一个二维数组 requirements 表示。这个二维数组的每个元素是一个长度为 3 的一维数组，对于某个剧情的触发条件 c[i], r[i], h[i]，如果当前 C >= c[i] 且 R >= r[i] 且 H >= h[i] ，则剧情会被触发。
 * 根据所给信息，请计算每个剧情的触发时间，并以一个数组返回。如果某个剧情不会被触发，则该剧情对应的触发时间为 -1 。
 * 
 * 示例 1：
 * 输入： increase = [[2,8,4],[2,5,0],[10,9,8]] requirements = [[2,11,3],[15,10,7],[9,17,12],[8,1,14]]
 * 输出: [2,-1,3,-1]
 * 解释：
 * 初始时，C = 0，R = 0，H = 0
 * 第 1 天，C = 2，R = 8，H = 4
 * 第 2 天，C = 4，R = 13，H = 4，此时触发剧情 0
 * 第 3 天，C = 14，R = 22，H = 12，此时触发剧情 2
 * 剧情 1 和 3 无法触发。
 * 
 * 示例 2：
 * 输入： increase = [[0,4,5],[4,8,8],[8,6,1],[10,10,0]] requirements = [[12,11,16],[20,2,6],[9,2,6],[10,18,3],[8,14,9]]
 * 输出: [-1,4,3,3,3]
 * 
 * 示例 3：
 * 输入： increase = [[1,1,1]] requirements = [[0,0,0]]
 * 输出: [0]
 * 
 * @param {number[][]} increase
 * @param {number[][]} requirements
 * @return {number[]}
 * 
 * 提示：
 * 1. 正常二分
 */

// test
console.log(getTriggerTime([[2,8,4],[2,5,0],[10,9,8]], [[2,11,3],[15,10,7],[9,17,12],[8,1,14]])); // [2,-1,3,-1]
console.log(getTriggerTime([[0,4,5],[4,8,8],[8,6,1],[10,10,0]], [[12,11,16],[20,2,6],[9,2,6],[10,18,3],[8,14,9]])); // [-1,4,3,3,3]
console.log(getTriggerTime([[1,1,1]], [[0,0,0]])); // [0]

var getTriggerTime = function(increase, requirements) {
  const result = [];
  const len = increase.length;
  const dayArr = Array.from({ length: len + 1 }, () => Array(3).fill(0));
  for (let i = 1; i <= len; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      dayArr[i][j] = dayArr[i - 1][j] + increase[i - 1][j];
    }
  }
  for (let i = 0; i < requirements.length; i += 1) {
    const req = requirements[i];
    let start = 0;
    let end = dayArr.length - 1;
    let index = -1;
    while (start <= end) {
      const mid = (start + end) >> 1;
      if (dayArr[mid].every((item, index) => item >= req[index])) {
        index = mid;
        end = mid - 1;
      } else {
        start = mid + 1;
      }
    }
    result[i] = index;
  }
  return result;
};