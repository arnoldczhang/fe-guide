/**
 * 101. 对称二叉树
 * 
 * 给你一个二叉树的根节点 root ， 检查它是否轴对称。
 * 
 * 示例 1：
 * 输入：root = [1,2,2,3,4,4,3]
 * 输出：true
 * 
 * 示例 2：
 * 输入：root = [1,2,2,null,3,null,3]
 * 输出：false
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
 * @return {boolean}
 */
var isTheSame = function(r1, r2) {
  if (!r1 || !r2) return r1 === r2;
  return r1.val === r2.val && isTheSame(r1.left, r2.right) && isTheSame(r1.right, r2.left);
}

var isSymmetric = function(root) {
  return isTheSame(root.left, root.right);
};