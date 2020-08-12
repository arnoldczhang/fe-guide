/**
 * 题目：
 * 二叉树最大深度
 */
const BinaryTree = require('../structure/二叉树.js');
const binaryTree = new BinaryTree();
binaryTree.insert(10);
binaryTree.insert(1);
binaryTree.insert(5);
binaryTree.insert(9);
binaryTree.insert(13);

function getMaxDepth(root) {
  if (!root) {
    return 0;
  }

  const lmd = getMaxDepth(root.left);
  const rmd = getMaxDepth(root.right);
  return Math.max(lmd, rmd) + 1;
}

console.log(getMaxDepth(binaryTree.root));