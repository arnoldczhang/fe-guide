/**
 * 题目：
 * 
 * 二叉树-左子树叶之和
 * 
 * 题设有迷惑性，左子树叶，指的是没有子节点的左子树叶，
 * 树中间的左子树叶不能计算在和内
 * 
 */
function sumOfLeftLeaves(root) {
  let sum = 0;
  if(!root) return 0;
  const dfs = (node) => {
    const { left, right, val } = node;
    if(!right && !left) return val;
    if(left) sum = dfs(left) + sum;
    if(right) dfs(right);
    return 0;
  }
  dfs(root);
  return sum;
};

console.log(sumOfLeftLeaves({
  val: 3,
  left: {
    val: 9,
    left: {
      val: 11,
    },
  },
  right: {
    val: 20,
    left: {
      val: 15,
    },
    right: {
      val: 7,
    },
  },
}));