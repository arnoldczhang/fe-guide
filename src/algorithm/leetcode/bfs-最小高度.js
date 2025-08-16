/**
 * 题目：
 * 
 * bfs-最小高度
 * 
 * 给定一个二叉树，找出其最小深度。
 * 最小深度是从根节点到最近叶子节点的最短路径上的节点数量。
 * 
 * 说明: 叶子节点是指没有子节点的节点。
 * 
 * 题解：
 * 
 */

function minDepth(root) {
  if (root === null) return 0;
  let depth = 1;
  const q = [root];

  while(q.length) {
    const { length } = q;
    for (let i = 0; i < length; i += 1) {
      const node = q.shift();
      const { left, right } = node;
      if (!left && !right) {
        return depth;
      }

      if (left) q.push(left);
      if (right) q.push(right);
    }
    depth += 1;
  }
}

console.log(minDepth({
  val: 3,
  left: {
    val: 9,
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