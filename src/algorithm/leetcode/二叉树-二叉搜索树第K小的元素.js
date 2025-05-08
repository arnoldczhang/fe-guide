/**
 * 230. 二叉搜索树中第 K 小的元素
 * 给定一个二叉搜索树的根节点 root ，和一个整数 k ，请你设计一个算法查找其中第 k 小的元素（从 1 开始计数）。
 * 
 * 
 * 示例 1：
 * 输入：root = [3,1,4,null,2], k = 1
 * 输出：1
 * 
 * 示例 2：
 * 输入：root = [5,3,6,2,4,null,null,1], k = 3
 * 输出：3
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
 * @param {number} k
 * @return {number}
 * 
 * 提示：
 * 1. 中序深度遍历
 * 2. 方法二：有点难，排序后，k递减，可以不借助额外数组获得答案
 */
var kthSmallest = function(root, k) {
  if (!root) return null;
  let ans = -1;
  const dfs = (node = root) => {
    if (!node) return;
    if (ans !== -1) return;
    const { left, right } = node;
    dfs(left);
    // 倒数开始，每次走到这里，表示经过一个节点
    if (--k === 0) {
      ans = node.val;
    }
    dfs(right);
  };
  dfs();
  return ans;
};

var kthSmallest2 = function(root, k) {
  if (!root) return null;
  const result = [];
  const dfs = (node = root) => {
    if (!node) return;
    const { left, right } = node;
    dfs(left);
    result.push(node);
    dfs(right);
  };
  dfs();
  return result[k - 1].val;
};