/**
 * 二叉树的最大深度
 * 
 * 给定一个二叉树 root ，返回其最大深度。
 * 二叉树的 最大深度 是指从根节点到最远叶子节点的最长路径上的节点数。
 *  
 * 
 * 示例 1：
 * 输入：root = [3,9,20,null,null,15,7]
 * 输出：3
 * 
 * 示例 2：
 * 输入：root = [1,null,2]
 * 输出：2
 * 
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
  if (!root) return 0;
  const { left, right } = root;
  return Math.max(maxDepth(left), maxDepth(right)) + 1;
};