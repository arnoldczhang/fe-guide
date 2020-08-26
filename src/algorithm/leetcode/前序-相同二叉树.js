/**
 * 题目：
 * 
 * 前序-相同二叉树
 * 
 * 如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的
 * 
 */
function isSameTree(p, q) {
  const isSame = (pre, next) => {
    if (pre === null && next === null) {
        return true;
    }

    if (pre === null || next === null) {
      return false;
    }

    if (pre.val !== next.val) {
        return false;
    }
    return isSame(pre.left, next.left) && isSame(pre.right, next.right);
  };
  return isSame(p, q);
};