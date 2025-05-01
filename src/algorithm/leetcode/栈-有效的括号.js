/**
 * 有效的括号
 * 
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
 * 有效字符串需满足：
 * 
 * 左括号必须用相同类型的右括号闭合。
 * 左括号必须以正确的顺序闭合。
 * 每个右括号都有一个对应的相同类型的左括号。
 *  
 * 示例 1：
 * 输入：s = "()"
 * 输出：true
 * 
 * 示例 2：
 * 输入：s = "()[]{}"
 * 输出：true
 * 
 * 示例 3：
 * 输入：s = "(]"
 * 输出：false
 * 
 * 示例 4：
 * 输入：s = "([])"
 * 输出：true
 * 
 * @param {string} s
 * @return {boolean}
*/

// test
console.log(isValid("()")); // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]")); // false

var isValid = function(s) {
  const len = s.length;
  // 奇数
  if (len % 2) return false;
  const map = {
    '(': ')',
    '{': '}',
    '[': ']',
  };
  const result = [];
  for (let i = 0; i < len; i += 1) {
    const item = s[i];
    if (map[item]) {
      result.push(item);
    } else {
      // 空栈
      if (!result.length) return false;
      if (map[result[result.length - 1]] !== item) return false;
      result.pop();
    }
  }
  return !result.length;
};
