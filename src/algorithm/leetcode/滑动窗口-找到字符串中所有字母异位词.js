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
 * 题解：
 * - 同字符串排列
 * 
 * 
 */
function findAnagrams(s, p) {
  const result = [];
  const { length } = s;
  const windowed = {};
  const need = [...p].reduce((res, pre) => {
    res[pre] = res[pre] || 0;
    res[pre] += 1;
    windowed[pre] = 0;
    return res;
  }, {});
  let left = 0;
  let right = 0;
  let valid = 0;
  while (right < length) {
    const rv = s[right];
    right += 1;

    if (rv in need) {
      windowed[rv] += 1;
      if (windowed[rv] === need[rv]) {
        valid += 1;
      }
    }

    while (right - left >= p.length) {
      if (valid === Object.keys(need).length) {
        result.push(left);
      }
      const lv = s[left];
      left += 1;

      if (lv in need) {
        if (windowed[lv] === need[lv]) {
          valid -= 1;
        }
        windowed[lv] -= 1;
      }
    }
  }
  return result;
}

console.log(findAnagrams('abab', 'ab'));
console.log(findAnagrams('cbaebabacd', 'abc'));
