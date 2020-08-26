/**
 * 题目：
 * 
 * 后序-左子树叶之和
 * 
 * 说明: 叶子节点是指没有子节点的节点。
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