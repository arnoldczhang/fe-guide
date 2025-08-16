/**
 * 题目：
 * 中序-二叉树遍历
 * 
 * 输入: [1,null,2,3]
 * 输出: [1,3,2]
 * 
 * 题解：
 * 
 */
function inorderTraversal(root) {
  const inorder = (node, result = []) => {
    if (!node) return result;
    const { left, right, val } = node;
    inorder(left, result);
    result.push(val);
    inorder(right, result);
    return result;
  };
  return inorder(root);
};
