/**
 * 题目：
 * 
 * 二叉树-前序遍历
 * 
 * 题解：
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

// 递归实现
function preorder(root) {
  const result = [];
  const order = (node) => {
    if (!node) {
      return null;
    }
    result.push(node.val);
    const { children } = node;
    if (children && children.length) {
      children.forEach((child) => {
        order(child);
      });
    }
  };
  order(root);
  return result;
};

console.log(preorder(binaryTree.root));