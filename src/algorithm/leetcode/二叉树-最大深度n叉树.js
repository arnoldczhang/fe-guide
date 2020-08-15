/**
 * 题目：
 * 
 * 二叉树-最大深度n叉树
 * 
 */
const BinaryTree = require('../structure/二叉树.js');
const binaryTree = new BinaryTree();
binaryTree.insert(1);
binaryTree.insert(3);
binaryTree.insert(2);
binaryTree.insert(4);
binaryTree.insert(5);
binaryTree.insert(6);

function maxDepth(root) {
  if (!root) {
      return 0;
  }
  const { children } = root;
  if (children && children.length) {
      return Math.max(...children.map(maxDepth)) + 1;
  }
  return 1;
};

maxDepth(binaryTree);