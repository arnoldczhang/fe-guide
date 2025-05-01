/**
 * 49. 字母异位词分组
 * 
 * 给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。
 * 字母异位词 是由重新排列源单词的所有字母得到的一个新单词。
 *  
 * 
 * 示例 1:
 * 输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
 * 输出: [["bat"],["nat","tan"],["ate","eat","tea"]]
 * 
 * 示例 2:
 * 输入: strs = [""]
 * 输出: [[""]]
 * 
 * 示例 3:
 * 输入: strs = ["a"]
 * 输出: [["a"]]
 * 
 * @param {string[]} strs
 * @return {string[][]}
 */

// test
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
console.log(groupAnagrams([""]));
console.log(groupAnagrams(["a"]));

var groupAnagrams = function(strs) {
  const result = [];
  const map = {};
  const startCode = 'a'.charCodeAt(0);
  for (let i = 0; i < strs.length; i += 1) {
    const str = strs[i];
    const arr = [];
    for (let j = 0; j < str.length; j += 1) {
      arr[str[j].charCodeAt(0) - startCode] = (arr[str[j].charCodeAt(0) - startCode] || 0) + 1
    }
    const key = arr.toString();
    if (map[key]) {
      map[key].push(str);
    } else {
      map[key] = [str];
      result.push(map[key]);
    }
  }
  return result;
};