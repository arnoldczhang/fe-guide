/**
 * 131. 分割回文串
 * 
 * 给你一个字符串 s，请你将 s 分割成一些 子串，使每个子串都是 回文串 。返回 s 所有可能的分割方案。
 * 
 * 
 * 示例 1：
 * 输入：s = "aab"
 * 输出：[["a","a","b"],["aa","b"]]
 * 
 * 示例 2：
 * 输入：s = "a"
 * 输出：[["a"]]
 * 
 * @param {string} s
 * @return {string[][]}
 * 
 * 提示：
 * 1. 纯套公式完了
 */

// test
console.log(partition("aab")); // [["a","a","b"],["aa","b"]]
console.log(partition("a")); // [["a"]]

var partition = function(s) {
  const result = [];
  const len = s.length;
  const isPalindrome = (s, left, right) => {
    while (left < right) {
      if (s.charAt(left++) !== s.charAt(right--)) {
        return false;
      }
    }
    return true;
  };
  const backtrack = (n = 0, arr = []) => {
    if (n >= len) return result.push(arr.slice());

    for (let i = n; i < len; i += 1) {
      if(!isPalindrome(s, n, i)) continue;
      const item = s.slice(n, i + 1);
      arr.push(item);
      backtrack(i + 1, arr);
      arr.pop();
    }
  }

  backtrack();
  return result;
};

