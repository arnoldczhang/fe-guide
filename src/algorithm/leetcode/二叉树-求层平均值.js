/**
 * 题目：
 * 
 * 二叉树-求层平均值
 * 
 */
function averageOfLevels(root) {
  const result = []
  const dfs = (node, level) => {
      if (node === null) return null;
      const { left, right, val } = node;
      result[level] = result[level] || [];
      result[level].push(val);
      dfs(left, level + 1);
      dfs(right, level + 1);
  };
  dfs(root, 0);
  return result.map(
      item => item.reduce((res, pre) => res + pre, 0) / item.length
  );
};