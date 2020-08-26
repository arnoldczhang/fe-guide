/**
 * 题目：
 * 滑动窗口-最小覆盖子串
 * 
 * 给你一个字符串 S、一个字符串 T 。
 * 请你设计一种算法，可以在 O(n) 的时间复杂度内，
 * 从字符串 S 里面找出：包含 T 所有字符的最小子串
 * 
 * 输入：S = "ADOBECODEBANC", T = "ABC"
 * 输出："BANC"
 * 
 * 题解：
 * - O(n)
 * - 先移动right，找出满足条件的窗口
 * - 再移动right，找出满足条件的最小窗口
 * - 找到最短的len
 * 
 */
function minWindow(s, t) {
  const windowed = {};
  const need = t.split('').reduce((res, pre) => {
    res[pre] = res[pre] || 0;
    res[pre] += 1;
    windowed[pre] = 0;
    return res;
  }, {});
  const { length } = s;
  if (length < t.length) return '';
  let left = 0;  
  let right = 0;
  let valid = 0;
  let start = 0;
  let len = Infinity;

  while (right < length) {
    const rv = s[right];
    right += 1;
    if (rv in need) {
      windowed[rv] += 1;
      if (windowed[rv] === need[rv]) {
        valid += 1;
      }
    }

    while (valid === Object.keys(need).length) {
      if (right - left < len) {
        len = right - left;
        start = left;
      }
      const willLeft = s[left];

      if (willLeft in need) {
        if (windowed[willLeft] === need[willLeft]) {
          valid -= 1;
        }
        windowed[willLeft] -= 1;
      }
      left += 1;
    }
  }
  return len === Infinity ? '' : s.substr(start, len);
}

console.log(minWindow('ADOBECODEBANC', 'ABC'));
