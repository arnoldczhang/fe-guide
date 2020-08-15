/**
 * 题目：
 * 
 * 二叉树-转累加树
 * 
 * 使得每个节点的值是原来的节点值加上所有大于它的节点值之和
 * 
 */
function convertBST(root) {
  let sum = 0;
  const convert = (node) => {
      if (node != null) {
          convert(node.right);
          sum += node.val;
          node.val = sum;
          convert(node.left);
      }
  };
  convert(root);
  return root;
};