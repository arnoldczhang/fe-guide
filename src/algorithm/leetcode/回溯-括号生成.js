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
function generateParenthesis(n) {
  const result = [];
  const backtrack = (left, right, track = []) => {
    if (right < left || left < 0 || right < 0) {
      return;
    }

    if (!left && !right) {
      return result.push(track.join(''));
    }

    track.push('(');
    backtrack(left - 1, right, track.slice());
    track.pop();

    track.push(')');
    backtrack(left, right - 1, track.slice());
    track.pop();
  };
  backtrack(n, n);
  return result;
}

console.log(generateParenthesis(3));