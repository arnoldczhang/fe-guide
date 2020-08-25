/**
 * 题目：
 * 
 * 前序-最大深度二叉树
 * 
 * 题解：
 * - 计算左右子树最大深度即可
 * 
 */
const BinaryTree = require('../structure/二叉树.js');
const binaryTree = new BinaryTree();
binaryTree.insert(10);
binaryTree.insert(1);
binaryTree.insert(5);
binaryTree.insert(9);
binaryTree.insert(13);

function maxDepth(root) {
  if (!root) {
    return 0;
  }
  const { left, right } = root;
  return Math.max(maxDepth(left), maxDepth(right)) + 1;
}

function maxDepth(root, depth = 0) {
  if (!root) return depth;
  const { left, right } = root;
  return Math.max(maxDepth(left, depth + 1), maxDepth(right, depth + 1));
}

console.log(maxDepth(binaryTree.root));
