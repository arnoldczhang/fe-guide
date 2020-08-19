/**
 * 题目：
 * 
 * 二叉树-合并二叉树
 * 
 * 将一棵二叉树上的节点覆盖到另一棵
 * 
 * 题解：
 * 
 * - 后续遍历
 * - 原节点如果存在，则值累加，否则直接替换即可
 * 
 */
const BinaryTree = require('../structure/二叉树.js');
const binaryTree = new BinaryTree();
binaryTree.insert(1);
binaryTree.insert(2);
binaryTree.insert(3);
binaryTree.insert(5);

const binaryTree2 = new BinaryTree();
binaryTree2.insert(2);
binaryTree2.insert(1);
binaryTree2.insert(3);
binaryTree2.insert(4);
binaryTree2.insert(7);

function mergeTrees(t1, t2) {
  if (t1 && t2) {
    t1.val += t2.val;
    t1.left = mergeTrees(t1.left, t2.left);
    t1.right = mergeTrees(t1.right, t2.right);
  }

  if (!t1 && t2) {
    return t2;
  }
  return t1;
}

console.log(mergeTrees(binaryTree.root, binaryTree2.root));
