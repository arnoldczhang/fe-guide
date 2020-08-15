/**
 * 二叉树-根到叶二进制之和
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