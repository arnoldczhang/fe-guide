/**
 * 题目：
 * 滑动窗口-字符串排列
 * 
 * 给定两个字符串 s1 和 s2，写一个函数来判断 s2 是否包含 s1 的排列。
 * 换句话说，第一个字符串的排列之一是第二个字符串的子串。
 * 
 * 输入: s1 = "ab" s2 = "eidbaooo"
 * 输出: True
 * 解释: s2 包含 s1 的排列之一 ("ba")
 * 
 * 题解：
 * - 窗口移动条件为长度>=s1长度
 * - 其他同最小覆盖子串
 * 
 */
function checkInclusion(s1, s2) {
  const { length } = s2;
  let left = 0;
  let right = 0;
  let valid = 0;
  const windowed = {};
  const need = [...s1].reduce((res, pre) => {
    res[pre] = res[pre] || 0;
    res[pre] += 1;
    windowed[pre] = 0;
    return res;
  }, {});

  while (right < length) {
    const rv = s2[right];
    right += 1;
    if (rv in need) {
      windowed[rv] += 1;
      if (windowed[rv] === need[rv]) {
        valid += 1;
      }
    }

    while (right - left >= s1.length) {
      if (valid === Object.keys(need).length) {
        return true;
      }
      const lv = s2[left];
      left += 1;
      if (lv in need) {
        if (need[lv] === windowed[lv]) {
          valid -= 1;
        }
        windowed[lv] -= 1;
      }
    }
  }
  return false;
}

debugger;
console.log(checkInclusion('ab', 'eidbaooo'));
