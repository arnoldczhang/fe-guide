/**
 * 题目：
 * 
 * 双指针-反转字符串
 * 
 */
function reverseString(s) {
  const { length } = s;
  if (!length) return s;
  let left = 0;
  let right = length - 1;
  let tmp;
  while (left < right) {
    tmp = s[left];
    s[left] = s[right];
    s[right] = tmp;
    left += 1;
    right -= 1;
  }
  return s;
}

console.log(reverseString(["h","e","l","l","o"]));