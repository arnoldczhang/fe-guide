/**
 * 题目：
 * 
 * 后序-二叉树搜索范围
 * 
 * 给定二叉搜索树的根结点 root，返回 L 和 R（含）之间的所有结点的值的和
 * 
 * 题解：
 * - 说白了，算出结点值在L和R之间（含）的所有结点之和即可
 * 
 */
const BinaryTree = require('../structure/二叉树.js');
const binaryTree = new BinaryTree();
binaryTree.insert(10);
binaryTree.insert(5);
binaryTree.insert(15);
binaryTree.insert(3);
binaryTree.insert(7);
binaryTree.insert(13);
binaryTree.insert(18);
binaryTree.insert(1);
binaryTree.insert(6);

function searchRange(root, L, R) {
  let sum = 0;
  const search = (node) => {
    if (!node) return;
    const { left, right, val } = node;
    search(left);
    search(right);
    if (val >= L && val <= R) {
      sum += val;
    }
  };
  search(root);
  return sum;
}

console.log(searchRange(binaryTree.root, 6, 10));