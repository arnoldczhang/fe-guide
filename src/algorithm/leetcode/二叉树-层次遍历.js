/**
 * 二叉树-层次遍历
 * 
 * 将每层的结点值输出，比如
 * [
 *    [2],
 *    [1, 3],
 *    [0, 2, 2, 4]
 * ]
 * 
 */
function levelOrderBottom(root) {
  const result = [];
  const dfs = (node, level) => {
    if (node === null) return root;
    result[level] = result[level] || [];
    const { left, right } = node;
    result[level].push(node.val);
    if (left) dfs(left, level + 1);
    if (right) dfs(right, level + 1);
  };
  dfs(root, 0);
  return result.reverse();
};