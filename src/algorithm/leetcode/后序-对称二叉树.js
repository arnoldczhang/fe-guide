/**
 * 题目：
 * 
 * 后序-对称二叉树
 * 
 * 给定一个二叉树，检查它是否是镜像对称的
 * 
 */
function isSymmetric(root) {
  const isSym = (left, right) => {
      if (left === null && right === null) {
          return true;
      }

      if (left === null || right === null) {
          return false;
      }
      return left.val === right.val
          && isSym(left.left, right.right)
          && isSym(left.right, right.left);
  };
  if (root === null) {
      return true;
  }
  const { left, right } = root;
  return isSym(left, right);
};