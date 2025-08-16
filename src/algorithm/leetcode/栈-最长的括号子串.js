/**
 * 题目：
 * 栈-最长的括号子串
 * 
 * 题解：
 * - 匹配到(入栈，匹配到)出栈，这时就能得到上个(的索引位
 * - -1作为参照位，用于计算长度
 */
function longestValidParentheses(s) {
  const { length } = s;
  let max = -Infinity;
  const stack = [-1];
  for (let i = 0; i < length; i += 1) {
    const val = s[i];
    if (val === '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length) {
        max = Math.max(max, i - stack[stack.length - 1]);
      } else {
        stack.push(i);
      }
    }
  }
  return max === -Infinity ? 0 : max;
}

console.log(longestValidParentheses(')()())'));
