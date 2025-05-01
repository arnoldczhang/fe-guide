/**
 * 739. 每日温度
 * 
 * 给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。
 * 
 * 
 * 示例 1:
 * 
 * 输入: temperatures = [73,74,75,71,69,72,76,73]
 * 输出: [1,1,4,2,1,1,0,0]
 * 示例 2:
 * 
 * 输入: temperatures = [30,40,50,60]
 * 输出: [1,1,1,0]
 * 示例 3:
 * 
 * 输入: temperatures = [30,60,90]
 * 输出: [1,1,0]
 * 
 * @param {number[]} temperatures
 * @return {number[]}
 */

// test
console.log(dailyTemperatures([73,74,75,71,69,72,76,73])); // [1,1,4,2,1,1,0,0]
console.log(dailyTemperatures([30,40,50,60])); // [1,1,1,0]
console.log(dailyTemperatures([30,60,90])); // [1,1,0]

var dailyTemperatures = function(temperatures) {
  const len = temperatures.length;
  const result = Array.from({ length: len }).fill(0);
  const todoIndexList = [];
  for (let i = 0; i < len; i += 1) {
    const temp = temperatures[i];
    while (todoIndexList.length && temp > temperatures[todoIndexList[todoIndexList.length - 1]]) {
      const todo = todoIndexList.pop();
      result[todo] = i - todo;
    }
    todoIndexList.push(i);
  }
  return result;
};