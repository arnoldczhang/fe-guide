/**
 * 题目：
 * 
 * 前序-根到叶二进制之和
 * 
 * 给出一棵二叉树，其上每个结点的值都是 0 或 1 。
 * 每一条从根到叶的路径都代表一个从最高有效位开始的二进制数。
 * 例如，如果路径为 0 -> 1 -> 1 -> 0 -> 1，那么它表示二进制数 01101，也就是 13
 * 
 * 输入：[1,0,1,0,1,0,1]
 * 输出：22
 * 解释：(100) + (101) + (110) + (111) = 4 + 5 + 6 + 7 = 22
 * 
 */
const TreeNode = require('../structure/二叉树.js');
const binaryTree = new TreeNode();
binaryTree.insert(1);
binaryTree.insert(0);
binaryTree.insert(1);
binaryTree.insert(0);
binaryTree.insert(1);
binaryTree.insert(0);
binaryTree.insert(1);

function sumRootToLeaf(root) {
  let sum = 0;
  const sumRL = (node, cach = []) => {
    if (node === null) {
      sum += parseInt(cach.join(''), 2);
      return null;
    }
    const { left, right, val } = node;
    if (left !== null && right === null) {
      return sumRL(left, cach.concat(val));
    }
    if (left === null && right !== null) {
      return sumRL(right, cach.concat(val));
    }
    if (left === null && right === null) {
      return sumRL(left, cach.concat(val));
    }
    sumRL(left, cach.concat(val));
    sumRL(right, cach.concat(val));
  };
  sumRL(root);
  return sum / 2;
};

debugger;
sumRootToLeaf({
  val: 1,
  left: {
    val: 0,
    left: {
      val: 0,
    },
    right: {
      val: 1,
    },
  },
  right: {
    val: 1,
    left: { val: 0 },
    right: { val: 1 },
  },
});