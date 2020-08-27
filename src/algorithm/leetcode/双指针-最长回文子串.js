/**
 * 题目：
 * 双指针-最长回文子串
 * 
 * 题解：
 * - 从中心点向外扩展，left-- + right++
 * - 考虑奇偶两种情况
 * 
 */
function longestPalindrome(s) {
  let result = s[0] || '';
  const { length } = s;
  for (let i = 0; i < length; i += 1) {
    for (let j = 1; j <= 2; j += 1) {
      let left = i;
      let right = i + j;
      while (left >= 0 && right < length && s[left] === s[right]) {
        left -= 1;
        right += 1;
      }

      const len = (right - 1 ) - (left + 1) + 1;
      if (len > result.length) {
        result = s.substr(left + 1, len);
      }
    }
  }
  return result;
}

console.log(longestPalindrome('babad'));
console.log(longestPalindrome('aaa'));
