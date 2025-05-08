/**
 * 105. 从前序与中序遍历序列构造二叉树
 * 
 * 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
 * 
 * 
 * 示例 1:
 * 输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 * 输出: [3,9,20,null,null,15,7]
 * 
 * 示例 2:
 * 输入: preorder = [-1], inorder = [-1]
 * 输出: [-1]
 * 
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 * 
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 * 
 * 提示：
 * 1. 巨难，要知道前序遍历和中序遍历的关系，知道数组和这两者的对应关系
 * 2. 前序：根节点 → 左子树 → 右子树
 * 3. 中序：左子树 → 根节点 → 右子树
 */
var buildTree = function(preorder, inorder) {
  let pre = i = 0
  const build = function(stop) {
    if (inorder[i] === stop) return null;
    const root = new TreeNode(preorder[pre++])
    root.left = build(root.val)
    i++
    root.right = build(stop)
    return root
  }
  return build()
};

var buildTree2 = function(preorder, inorder) {
  if (!preorder.length || !inorder.length) return null;
  const rootVal = preorder[0];
  const midIndex = inorder.indexOf(rootVal);
  const preLeft = preorder.slice(1, midIndex + 1);
  const preRight = preorder.slice(midIndex + 1);
  const inLeft = inorder.slice(0, midIndex);
  const inRight = inorder.slice(midIndex + 1);
  
  return new TreeNode(
    rootVal,
    buildTree(preLeft, inLeft),
    buildTree(preRight, inRight),
  );
};