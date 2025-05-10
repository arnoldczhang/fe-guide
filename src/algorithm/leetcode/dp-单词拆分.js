/**
 * 139. 单词拆分
 * 
 * 给你一个字符串 s 和一个字符串列表 wordDict 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 s 则返回 true。
 * 注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。
 * 
 * 
 * 示例 1：
 * 输入: s = "leetcode", wordDict = ["leet", "code"]
 * 输出: true
 * 解释: 返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。
 * 
 * 示例 2：
 * 输入: s = "applepenapple", wordDict = ["apple", "pen"]
 * 输出: true
 * 解释: 返回 true 因为 "applepenapple" 可以由 "apple" "pen" "apple" 拼接成。
 * 注意，你可以重复使用字典中的单词。
 * 
 * 示例 3：
 * 输入: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
 * 输出: false
 * 
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 * 
 * 提示：
 * 1. 除了空字符串，默认都是未匹配false
 * 2. 分段匹配，即当前段是否匹配，还取决于上一段是否匹配
 * 
 */

// test
console.log(wordBreak("leetcode", ["leet", "code"])); // true
console.log(wordBreak("applepenapple", ["apple", "pen"])); // true
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])); // false

var wordBreak = function(s, wordDict) {
  const dp = Array(s.length + 1).fill(false);
  // 空字符串，默认是能匹配的
  dp[0] = true;
  for (let i = 1; i <= s.length; i += 1) {
    for (let j = 0; j < wordDict.length; j += 1) {
      const dict = wordDict[j];
      if (i < dict.length) continue;
      // 当前段和之前段都匹配，才是真匹配
      if (s.slice(i - dict.length, i) === dict && dp[i - dict.length]) {
        dp[i] = true;
      }
    }
  }
  return dp[s.length];
};