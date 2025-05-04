/**
 * 题目：
 * 
 * 滑动窗口-找到字符串中所有字母异位词
 * 
 * 给定一个字符串 s 和一个非空字符串 p，找到 s 中所有是 p 的字母异位词的子串，返回这些子串的起始索引。
 * 字符串只包含小写英文字母，并且字符串 s 和 p 的长度都不超过 20100。
 * 说明：
 * 
 * 字母异位词指字母相同，但排列不同的字符串。
 * 不考虑答案输出的顺序。
 * 
 * 输入: s: "abab" p: "ab"
 * 输出: [0, 1, 2]
 * 
 * 提示：
 * - 定长窗口最简单，但不够快
 * - 不定长，需要借助数组，巧技
 * 
 * 
 */

// test
console.log(findAnagrams('abab', 'ab'));
console.log(findAnagrams('cbaebabacd', 'abc'));

const getCode = (s) => s.charCodeAt(0) - 'a'.charCodeAt(0);

/**
 * 不定长窗口做法
 * 
 * - 相当于每个窗口只有一个字母
 * 
 * @param {*} s 
 * @param {*} p 
 * @returns 
 */
var findAnagrams = function(s, p) {
  const result = [];
  if (p.length > s.length) return result;
  const targetArr = Array.from({ length: 26 }).fill(0);
  for (const item of p) {
    targetArr[getCode(item)] += 1;
  }

  let left = 0;
  let right = 0;
  while (right < s.length) {
    // right进入窗口后，减一
    targetArr[getCode(s[right])] -= 1;

    // 多了
    while (targetArr[getCode(s[right])] < 0) {
      targetArr[getCode(s[left])] += 1;
      left += 1;
    }

    if (right - left + 1 === p.length) {
      result.push(left);
    }
    right += 1;
  }
  return result;
};

/**
 * 定长窗口
 * @param {*} s 
 * @param {*} p 
 * @returns 
 */
var findAnagrams2 = function(s, p) {
  const result = [];
  if (p.length > s.length) return result;
  const targetArr = Array.from({ length: 26 }).fill(0);
  const currentArr = Array.from({ length: 26 }).fill(0);
  let left = 0;
  let right = p.length - 1;

  const getCode = (s) => s.charCodeAt(0) - 'a'.charCodeAt(0);

  p.split('').forEach((item) => {
    targetArr[getCode(item)] += 1;
  });
  for (let i = left; i <= right; i += 1) {
    const item = s[i];
    currentArr[getCode(item)] += 1;
  }

  while (right < s.length) {
    if (currentArr.join() === targetArr.join()) {
      result.push(left);
    }
    if (right === s.length - 1) break;
    currentArr[getCode(s[left++])] -= 1;
    currentArr[getCode(s[++right])] += 1;
  }
  return result;
};