/**
 * 题目：
 * 
 * 二叉树-递增顺序查找树
 * 
 * 题解：
 * - 中序遍历拼出新数组
 * - 数组遍历重新拼成树
 * 
 */
const TreeNode = require('../structure/二叉树.js');
const binaryTree = new TreeNode();
binaryTree.insert(5);
binaryTree.insert(3);
binaryTree.insert(6);
binaryTree.insert(2);
binaryTree.insert(4);
binaryTree.insert(1);
binaryTree.insert(8);
binaryTree.insert(7);
binaryTree.insert(9);

function increasingBST(root) {
  const increase = (node) => {
    if (!node) {
      return null;
    }
    const { left, right } = node;
    return (increase(left) || [])
      .concat(node)
      .concat(increase(right) || []);
  };
  const list = increase(root);
  const result = list.shift();
  let curr;
  while (list.length) {
    const item = list.shift();
    curr.left = null;
    curr.right = new TreeNode(item.val);
    curr = curr.right;
  }
  return result;
}
increasingBST(binaryTree.root);