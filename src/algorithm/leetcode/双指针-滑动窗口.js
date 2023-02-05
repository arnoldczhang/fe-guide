// const inWindow = (str = '', target = '') => {
//   const need = target.split('').reduce((res, pre) => {
//     res[pre] = res[pre] || 0;
//     res[pre] += 1;
//     return res;
//   }, {});
//   const windowed = {};
//   let valid = 0;
//   let left = 0;
//   let right = 0;
//   let start = 0;
//   let len = Number.MAX_SAFE_INTEGER;

//   while (right < str.length) {
//     const current = str[right];
//     right += 1;
//     if (current in need) {
//       windowed[current] = windowed[current] || 0;
//       windowed[current] += 1;
//       if (windowed[current] === need[current]) {
//         valid += 1;
//       }
//     }

//     while (valid === Object.keys(need).length) {
//       if (right - left < len) {
//         start = left;
//         len = right - left;
//       }
//       const current = str[left];
//       left += 1;
//       if (current in need) {
//         if (windowed[current] === need[current]) {
//           valid -= 1;
//         }
//         windowed[current] -= 1;
//       }
//     }
//   }
//   return len === Number.MAX_SAFE_INTEGER ? '' : str.substr(start, len);
// };

// // test
// console.log(inWindow('ADOBECODEBANC', 'ABC'));
// // BANC