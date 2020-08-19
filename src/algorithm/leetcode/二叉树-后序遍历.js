/**
 * 题目：
 * 
 * 二叉树-后序遍历
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
function postorder(root) {
  const result = [];
  const order = (node) => {
    if (!node) {
      return null;
    }
    const { children } = node;
    if (children && children.length) {
      children.forEach((child) => {
        order(child);
      });
    }
    result.push(node.val);
  };
  order(root);
  return result;
};

// 遍历实现
function postorder2(root) {
  const result = [];
  const stack = [root];
  while (stack.length) {
    const tmp = stack.pop();
    if (!tmp) {
      continue;
    }
    result.unshift(tmp);
    const { children } = tmp;
    if (children && children.length) {
      stack.push(...children);
    }
  }
  return result.map(item => item.val);
};

console.log(postorder(binaryTree.root));