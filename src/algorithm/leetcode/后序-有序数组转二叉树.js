/**
 * 题目：
 * 
 * 后序-有序数组转二叉树
 * 
 * 题解：
 * - 分治
 * 
 */
const TreeNode = require('../structure/二叉树.js');
function sortedArrayToBST(nums) {
  const { length } = nums;
  if (!length) return null;
  const mid = length >> 1;
  const node = new TreeNode(nums[mid]);
  node.left = sortedArrayToBST(nums.slice(0, mid));
  node.right = sortedArrayToBST(nums.slice(mid + 1));
  return node;
};

console.log(sortedArrayToBST([-10,-3,0,5,9]));