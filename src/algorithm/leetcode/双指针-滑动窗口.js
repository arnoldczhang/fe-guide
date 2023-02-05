/**
 * Q1：最小覆盖子串
 * 
 * - 给一个字符串a，在里面找能覆盖字符串b的最短字符串
 * - 比如：在ADOBECODEBANC里找ABC，返回BANC
 * 
 */
// const inWindow = (str = '', target = '') => {
//   const need = target.split('').reduce((res, pre) => {
//     res[pre] = res[pre] || 0;
//     res[pre] += 1;
//     return res;
//   }, {});
//   const windowed = {};
//   let left = 0;
//   let right = 0;
//   let valid = 0;
//   let needValid = Object.keys(need).length;
//   let len = Number.MAX_SAFE_INTEGER;
//   let start = 0;
//   while (right <= str.length) {
//     const rightLetter = str[right];
//     right += 1;
//     if (rightLetter in need) {
//       windowed[rightLetter] = windowed[rightLetter] || 0;
//       windowed[rightLetter] += 1;

//       if (windowed[rightLetter] === need[rightLetter]) {
//         valid += 1;
//       }
//     }

//     while (valid === needValid) {
//       const leftLetter = str[left];
//       if (leftLetter in need) {
//         windowed[leftLetter] = windowed[leftLetter] || 0;
//         windowed[leftLetter] -= 1;

//         if (windowed[leftLetter] < need[leftLetter]) {
//           valid -= 1;
//           if (right - left < len) {
//             len = right - left;
//             start = left;
//           }
//         }
//       }
//       left += 1;
//     }
//   }
//   return len === Number.MAX_SAFE_INTEGER ? '' : str.substr(start, len);
// };

// // test
// console.log(inWindow('ADOBECODEBANC', 'ABC'));
// // BANC



/**
 * Q2：字符串排列
 * 
 * - 给两个字符串s1和s2，判断s1的排列之一是s2子串
 */
// const inWindow = (str = '', target = '') => {
//   const need = str.split('').reduce((res, pre) => {
//     res[pre] = res[pre] || 0;
//     res[pre] += 1;
//     return res;
//   }, {});
//   let windowed = {};
//   let left = 0;
//   let right = 0;
//   let result = false;
//   let needValid = Object.keys(need).length;
//   let valid = 0;
//   while (right < target.length) {
//     const rightLetter = target[right];
//     right += 1;

//     if (rightLetter in need) {
//       windowed[rightLetter] = windowed[rightLetter] || 0;
//       windowed[rightLetter] += 1;

//       if (windowed[rightLetter] === need[rightLetter]) {
//         valid += 1;
//       }
//     } else {
//       if (valid) {
//         valid = 0;
//         windowed = {};
//       }
//       continue;
//     }

//     if (valid === needValid) {
//       return true;
//     }
//   }
//   return result;
// };

// // test
// console.log(inWindow('ab', 'eidbaooo'));
// // true
// console.log(inWindow('ab', 'eidboaoooo'));
// // false



/**
 * Q3：找出所有字母异位词
 * 
 * - 给两个字符串s1和s2，返回s2包含s1的所有异位词索引
 * - bca、bac、cab都是abc的异位词
 */
// const inWindow = (str = '', target = '') => {
//   const need = str.split('').reduce((res, pre) => {
//     res[pre] = res[pre] || 0;
//     res[pre] += 1;
//     return res;
//   }, {});
//   let windowed = {};
//   let left = 0;
//   let right = 0;
//   let result = [];
//   let needValid = Object.keys(need).length;
//   let valid = 0;
//   while (right < target.length) {
//     const rightLetter = target[right];
//     right += 1;
//     if (rightLetter in need) {
//       windowed[rightLetter] = windowed[rightLetter] || 0;
//       windowed[rightLetter] += 1;

//       if (windowed[rightLetter] === need[rightLetter]) {
//         valid += 1;
//       }
//     }

//     if (valid === needValid) {
//       result.push(left);
//     }

//     if (right - left >= str.length) {
//       const leftLetter = target[left];
//       if (leftLetter in need) {
//         windowed[leftLetter] = windowed[leftLetter] || 0;
//         windowed[leftLetter] -= 1;

//         if (windowed[leftLetter] < need[leftLetter]) {
//           valid -= 1;
//         }
//       }
//       left += 1;
//     }
//   }
//   return result;
// };

// // test
// console.log(inWindow('abc', 'cbaebabacd'));
// // [0, 6]



/**
 * Q4：最长无重复子串
 * 
 * - 找出字符串中无重复字符的最长长度
 */
// const inWindow = (str = '') => {
//   const windowed = {};
//   let result = 0;
//   let left = 0;
//   let right = 0;
//   while (right <= str.length) {
//     const rightLetter = str[right];
//     windowed[rightLetter] = windowed[rightLetter] || 0;
//     windowed[rightLetter] += 1;

//     while (windowed[rightLetter] > 1) {
//       result = Math.max(result, right - left);
//       const leftLetter = str[left];
//       left += 1;
//       windowed[leftLetter] = windowed[leftLetter] || 0;
//       windowed[leftLetter] -= 1;
//     }
//     right += 1;
//   }
//   return result;
// };

// // test
// console.log(inWindow('abcabcbb'));
// // 3
// console.log(inWindow('bbbb'));
// // 1
