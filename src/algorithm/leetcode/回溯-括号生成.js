/**
 * 题目：
 * 回溯-括号生成
 * 
 * 数字 n 代表生成括号的对数，请你设计一个函数，
 * 用于能够生成所有可能的并且 有效的 括号组合
 * 
 * 输入：n = 3
 * 输出：[
 *  "((()))",
 *  "(()())",
 *  "(())()",
 *  "()(())",
 *  "()()()"
 * ]
 * 
 * 题解：
 * - 反正很屌，不明觉厉
 * 
 */

// test
console.log(generateParenthesis(3));

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
    // 右括号数不到n，可继续添加
    if (i - open < open) {
      arr.push(')');
      backtrack(i + 1, arr, open);
      arr.pop();
    }
  }

  backtrack();
  return result;
};
