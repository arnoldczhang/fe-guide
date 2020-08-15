/**
 * 题目：
 * 
 * 二叉树-单值二叉树
 * 
 * 所有结点值都要相等
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

function isUnivalTree(root) {
  const baseVal = root.val;
  const isUnival = (node) => {
      if (!node) {
          return true;
      }
      const { left, right, val } = node;
      if (val !== baseVal) {
          return false;
      }
      return isUnival(left) && isUnival(right);
  };
  return isUnival(root);
};

isUnivalTree(binaryTree);