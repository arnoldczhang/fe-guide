# js常用算法与数据结构

## 参考
  - [算法教程](https://github.com/trekhleb/javascript-algorithms/blob/master/README.zh-CN.md)
  - [数据结构Array、HashMap 与 List](https://mp.weixin.qq.com/s/zY78mB6eMQBtzMqSSaldlQ)
  - [数据结构Array、HashMap 与 List(原文)](https://www.zcfy.cc/article/data-structures-for-beginners-arrays-hashmaps-and-lists)
  - [logN的由来](n.bing.com/?toHttps=1&redig=54178BEC83A640CE878C8B4736F9C008)
  - [各种算法结构演示](https://visualgo.net/zh)
  - [前端算法-git](https://juejin.im/post/5d5b307b5188253da24d3cd1?utm_source=gold_browser_extension)
  - [前端算法-docs](http://www.conardli.top/docs/dataStructure/%E4%BA%8C%E5%8F%89%E6%A0%91/%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C.html#%E6%A0%91%E6%9F%A5%E6%89%BE)

## 目录
<details>
<summary>展开更多</summary>

* [`时间复杂度`](#时间复杂度)
* [`二叉树`](#二叉树)
* [`链表`](#链表)
* [`数组`](#数组)
* [`堆`](#堆)
* [`哈希表`](#哈希表)
* [`栈和队列`](#栈和队列)
* [`字符串`](#字符串)

</details>

## 时间复杂度

### 常用的JS 数组内置函数
  - O(1)
    - array.push
    - array.pop
    - array.shift
  - O(n)
    - array.unshift
    - array.slice
    - array.splice
    - 数组中查找/删除某个元素
  - O(log n)
    - 二叉搜索


### 复杂度计算 - 推导大O阶
1. 用常数1来取代运行时间中所有加法常数。
2. 修改后的运行次数函数中，只保留最高阶项
3. 如果最高阶项存在且不是1，则去除与这个项相乘的常数。

### 复杂度对比
O(1)<O(logn)<O(n)<O(nlogn)<O(n²)<O(n³)<O(2ⁿ)<O(n!)

---

## 二叉树
详见[二叉树](./二叉树.js)

### 概念
1. 每个节点最多有两个子树
2. 左子树所有节点值小于父节点，以及右子树所有节点
3. 第n层最多有2^n个节点
4. n层最多有2^0 + 2^1 + ... + 2^n = 2^n+1 - 1个节点

### 结构
```js
class Node {
  constructor(data, left, right) {}
}

class Tree {
  constructor(root) {}
  // 根据【概念2】插入节点
  insert(node) {}
  // 获取最左子节点
  getMin() {}
  // 获取最右子节点
  getMax() {}
  // 查找特定node
  getNode(data, node) {}
  // 获取特定节点的深度（左、右子树的最大深度）
  getDeep(node, deep) {}
}
```

### 查找

**树查找**

```js
function getNode(data, node) {
  while (1) {
    if (!node) {
      return null;
    }

    const { data: d, left, right } = node;
    if (data === d) {
      return node;
    } else if (data > d) {
      node = right;
    } else {
      node = left;
    }
  }
};
```

**二分查找**

```js
function binarySearch(target, list, start = 0, end = list.length) {
  while(1) {
    if (start > end) {
      return -1;
    }
    const mid = Math.floor((start + end) / 2);
    const value = list[mid];
    if (target === value) {
      return mid;
    } else if (target > value) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
};
```

### 遍历




