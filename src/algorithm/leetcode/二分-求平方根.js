/**
 * 题目：
 * 二分-求平方根
 * 
 * 题解：
 * 
 */
// function mySqrt(x) {
//   if (x < 0) return null;
//   if (x === 1) return x;
//   let res = x >> 1;
//   while (res * res > x) res >>= 1;
//   while (res * res < x) res += 1;
//   if (res * res === x) return res;
//   return res - 1;
// }

// 二分解
function mySqrt(x) {
  if (x < 2) return x;
  let left = 1;
  let mid;
  let right = x >> 2;
  while (left <= right) {
    mid = (left + (right - left) >> 1) >> 0;
    if (mid * mid === x) return mid;
    if (mid * mid < x) {
      left = mid + 1;
    }else {
      right = mid - 1;
    }
  }
  return right;
}