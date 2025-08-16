/**
 * 437. 路径总和 III
 * 
 * 给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。
 * 路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。
 * 
 * 
 * 示例 1：
 * 输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
 * 输出：3
 * 解释：和等于 8 的路径有 3 条，如图所示。
 * 
 * 示例 2：
 * 输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
 * 输出：3
 * 
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 * 
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 * 
 * 提示：
 * 1. 回溯 + 记录状态
 * 
 */
var pathSum = function(root, targetSum) {
  if (!root) return 0;
  let result = 0;
  const cach = new Map();
  // 减到0，说明匹配到了
  cach.set(0, 1);
  const dfs = (node, value) => {
    if (!node) return;
    value += node.val;
    result += cach.get(value - targetSum) ?? 0;
    // 在这条路径上，累加和value计数为1
    cach.set(value, (cach.get(value) || 0) + 1);
    dfs(node.left, value);
    dfs(node.right, value);
    // 回退状态，从另条路径再匹配
    cach.set(value, (cach.get(value) || 0) - 1);
  };
  dfs(root, 0);
  return result;
};