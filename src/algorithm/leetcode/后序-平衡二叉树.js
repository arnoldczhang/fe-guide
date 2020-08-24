/**
 * 题目：
 * 
 * 后序-平衡二叉树
 * 
 * 平衡二叉树，即二叉树每个节点的左右两个子树的高度差的绝对值不超过1
 * 
 * 题解：
 * - 每个节点都要比较
 * 
 */

// 普通后序
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
}

// 后序 + 节点深度缓存优化
function isBalanced(root, cach = new Map()) {
  if (!root) return true;
  const { left, right } = root;
  const getMax = (node) => {
    if (!node) return 0;
    const { left, right } = node;
    let leftM = 0;
    if (left) {
      if (cach.has(left))  {
        leftM = cach.get(left);
      } else {
        leftM = getMax(left);
        cach.set(left, leftM);
      }
    }

    let rightM = 0;
    if (right) {
      if (cach.has(right))  {
        rightM = cach.get(right);
      } else {
        rightM = getMax(right);
        cach.set(right, leftM);
      }
    }
    return Math.max(leftM, rightM) + 1;
  };
  if (Math.abs(getMax(left) - getMax(right)) > 1) {
    return false;
  }
  return isBalanced(left) && isBalanced(right);
}

console.log(isBalanced({
  val: 1,
  left: {
    val: 2,
    left: {
      val: 3,
      left: {
        val: 4,
      },
      right: {
        val: 4,
      },
    },
    right: {
      val: 3,
    },
  },
  right: {
    val: 2,
  },
}));
