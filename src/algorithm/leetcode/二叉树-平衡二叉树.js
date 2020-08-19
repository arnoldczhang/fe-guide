/**
 * 题目：
 * 
 * 二叉树-平衡二叉树
 * 
 * 平衡二叉树，即一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过1
 * 
 */
function isBalanced(root) {
  const getMax = (node) => {
    if (node === null) {
      return 0;
    }
    const { left, right } = node;
    const leftMax = getMax(left);
    const rightMax = getMax(right);
    return Math.max(leftMax, rightMax) + 1;
  };

  if (root === null) {
    return true;
  }

  const { left, right } = root;
  if (Math.abs(getMax(left) - getMax(right)) > 1) {
    return false;
  }
  return isBalanced(left) && isBalanced(right);
};