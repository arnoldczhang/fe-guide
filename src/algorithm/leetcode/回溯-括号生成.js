/**
 * 22. 括号生成
 * 
 * 数字 n 代表生成括号的对数，请你设计一个函数，
 * 用于能够生成所有可能的并且 有效的 括号组合
 * 
 * 示例 1：
 * 输入：n = 3
 * 输出：["((()))","(()())","(())()","()(())","()()()"]
 * 
 * 示例 2：
 * 输入：n = 1
 * 输出：["()"]
 * 
 * 题解：
 * - 反正很屌，不明觉厉
 * 
 */

// test
console.log(generateParenthesis(3)); // ["((()))","(()())","(())()","()(())","()()()"]
console.log(generateParenthesis(1)); // ["()"]

var generateParenthesis = function(n) {
  const len = n * 2;
  const result = [];

  const backtrack = (i = 0, arr = [], open = 0) => {
    if (i === len) return result.push(arr.join(''));
    // 左括号数不到n，可继续添加
    if (open < n) {
      arr.push('(');
      backtrack(i + 1, arr, open + 1);
      arr.pop();
    }
    // 当前索引不超过2倍括号数，右括号可继续添加
    if (i < 2 * open) {
      arr.push(')');
      backtrack(i + 1, arr, open);
      arr.pop();
    }
  }

  backtrack();
  return result;
};
