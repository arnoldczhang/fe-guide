/**
 * 题目：
 * 
 * 中序-转累加树
 * 
 * 使得每个节点的值是原来的节点值加上所有大于它的节点值之和
 * 
 * 题解：
 * - 优先计算右子树的右子树的...
 * - 再计算右子树的左子树的右子树的右子树的...
 * - 最后计算左子树的右子树的右子树的...
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