/**
 * 题目：
 * 
 * 二叉树-搜索结点
 * 
 * - 给定二叉搜索树（BST）的根节点和一个值
 * - 需要在BST中找到节点值等于给定值的节点，返回以该节点为根的子树。
 * - 如果节点不存在，则返回 NULL
 * 
 * 题解：
 * 
 */
const BinaryTree = require('../structure/二叉树.js');
const binaryTree = new BinaryTree();
binaryTree.insert(4);
binaryTree.insert(2);
binaryTree.insert(7);
binaryTree.insert(1);
binaryTree.insert(3);

function searchBST(root, val) {
  if (!root) {
      return null;
  }

  if (root.val === val) {
      return root;
  }
  const { left, right } = root;
  return root.val > val ? searchBST(left, val) : searchBST(right, val);
};

console.log(searchBST(binaryTree.root));