/**
 * 题目：
 * 
 * 字符串的所有组合数，如input: 'abc', output: 'abc'、'acb'、'bac'、'bca'、'cab'、'cba'
 * 
 * 思路：
 *  - n!
 *  - 依次从字符串中取出顺位单个字符
 *  - 剩余字符递归做步骤1，直至含有一个字符为止
 *  - 由于每单个字符都有机会排到第一位，所以能遍历出所有排序结果
 */

// 遍历
function perm(s) {
  var result = [];
  if (s.length <= 1) {
    return [s];
  } else {
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      var newStr = s.slice(0, i) + s.slice(i + 1, s.length);
      var l = perm(newStr);
         
      for (var j = 0; j < l.length; j++) {
        var tmp = c + l[j];
        result.push(tmp);
      }
    }
  }
  return result;
}

// 回溯
function perm(s) {
  const { length } = s;
  const result = [];
  const backtrack = (track = []) => {
    if (track.length === length) {
      return result.push(track.join(''));
    }
    for (let i = 0; i < length; i += 1) {
      if (track.includes(s[i])) {
        continue;
      }
      track.push(s[i]);
      backtrack(track.slice());
      track.pop();
    }
  };
  backtrack();
  return result;
}

console.log(perm('abcdef'));