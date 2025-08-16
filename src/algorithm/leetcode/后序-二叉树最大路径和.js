/**
 * 题目：
 * 
 * 后序-二叉树最大路径和
 * 
 * 路径被定义为一条从树中任意节点出发，达到任意节点的序列。
 * 该路径至少包含一个节点，且不一定经过根节点
 * 
 * 题解：
 * - 后续遍历 + 求左右子树max
 * 
 */

const BinaryTree = require('../structure/二叉树.js');
const binaryTree = new BinaryTree();
binaryTree.insert(3);
binaryTree.insert(1);
binaryTree.insert(5);

const binaryTree2 = new BinaryTree();
binaryTree2.insert(-10);
binaryTree2.insert(9);
binaryTree2.insert(20);
binaryTree2.insert(15);
binaryTree2.insert(7);

function maxPathSum(root) {
  let maxRes = Number.MIN_SAFE_INTEGER;
  const getMax = (node) => {
    if (!node) return 0;
    const { left, right, val } = node;
    const leftVal = Math.max(0, getMax(left));
    const rightVal = Math.max(0, getMax(right));
    maxRes = Math.max(maxRes, leftVal + rightVal + val);
    // 取左右子树中，总和最大的一条路径，作为从当前节点开始的一条最大路径和
    return Math.max(leftVal, rightVal) + val;
  };
  getMax(root);
  return maxRes;
};

console.log(maxPathSum(binaryTree.root));
// console.log(maxPathSum(binaryTree2.root));