/**
 * 199. 二叉树的右视图
 * 
 * 示例 1：
 * 输入：root = [1,2,3,null,5,null,4]
 * 输出：[1,3,4]
 * 
 * 示例 2：
 * 输入：root = [1,2,3,4,null,null,null,5]
 * 输出：[1,3,4,5]
 * 
 * 示例 3：
 * 输入：root = [1,null,3]
 * 输出：[1,3]
 * 
 * 示例 4：
 * 输入：root = []
 * 输出：[]
 * 
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 * @param {TreeNode} root
 * @return {number[]}
 * 
 * 提示：
 * 1. 方式一：队列遍历
 * 2. 方式二：变异的先序深度遍历（根节点 → 右子树 → 左子树）
 */
var rightSideView = function(root) {
  const result = [];
  if (!root) return result;
  const dfs = (node = root, level = 0) => {
    if (!node) return null;
    if (result.length === level) {
      result.push(node.val);
    }
    dfs(node.right, level + 1);
    dfs(node.left, level + 1);
  };
  dfs();
  return result;
};

var rightSideView2 = function(root) {
  const result = [];
  if (!root) return result;
  const queue = [root];
  while (queue.length) {
    result.push(queue[queue.length - 1].val);
    let len = queue.length;
    while (len-- > 0) {
      const node = queue.shift();
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return result;
};