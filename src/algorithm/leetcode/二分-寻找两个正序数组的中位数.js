/**
 * 寻找两个正序数组的中位数
 * 
 * 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。
 * 算法的时间复杂度应该为 O(log (m+n)) 。
 * 
 * 示例 1：
 * 
 * 输入：nums1 = [1,3], nums2 = [2]
 * 输出：2.00000
 * 解释：合并数组 = [1,2,3] ，中位数 2
 * 示例 2：
 * 
 * 输入：nums1 = [1,2], nums2 = [3,4]
 * 输出：2.50000
 * 解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
 * 
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
var findMedianSortedArrays = function(a, b) {
  if (a.length > b.length) {
      [a, b] = [b, a];
  }

  const m = a.length, n = b.length;
  // 循环不变量：a[left] <= b[j+1]
  // 循环不变量：a[right] > b[j+1]
  let left = -1, right = m;
  while (left + 1 < right) { // 开区间 (left, right) 不为空
      const i = Math.floor((left + right) / 2);
      const j = Math.floor((m + n - 3) / 2) - i;
      if (a[i] <= b[j + 1]) {
          left = i; // 缩小二分区间为 (i, right)
      } else {
          right = i; // 缩小二分区间为 (left, i)
      }
  }

  // 此时 left 等于 right-1
  // a[left] <= b[j+1] 且 a[right] > b[j'+1] = b[j]，所以答案是 i=left
  const i = left;
  const j = Math.floor((m + n - 3) / 2) - i;
  const ai = i >= 0 ? a[i] : -Infinity;
  const bj = j >= 0 ? b[j] : -Infinity;
  const ai1 = i + 1 < m ? a[i + 1] : Infinity;
  const bj1 = j + 1 < n ? b[j + 1] : Infinity;
  const max1 = Math.max(ai, bj);
  const min2 = Math.min(ai1, bj1);
  return (m + n) % 2 ? max1 : (max1 + min2) / 2;
};