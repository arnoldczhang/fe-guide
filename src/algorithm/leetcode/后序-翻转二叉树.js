/**
 * 题目：
 * 
 * 后序-翻转二叉树
 * 
 * 左右交换二叉树节点
 * 
 * 题解：
 * - 后序遍历
 * 
 */
const BinaryTree = require('../structure/二叉树.js');
const binaryTree = new BinaryTree();
binaryTree.insert(4);
binaryTree.insert(2);
binaryTree.insert(7);
binaryTree.insert(1);
binaryTree.insert(3);
binaryTree.insert(6);
binaryTree.insert(9);

function invertTree(root) {
  if (!root) {
    return null;
  }
  const { left, right } = root;
  invertTree(left);
  invertTree(right);
  const tmp = left;
  root.left = root.right;
  root.right = tmp;
  return root;
}

console.log(invertTree(binaryTree.root));
