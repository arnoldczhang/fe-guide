# js常用算法与数据结构

## 参考
  - [算法教程](https://github.com/trekhleb/javascript-algorithms/blob/master/README.zh-CN.md)
  - [数据结构Array、HashMap 与 List](https://mp.weixin.qq.com/s/zY78mB6eMQBtzMqSSaldlQ)
  - [数据结构Array、HashMap 与 List(原文)](https://www.zcfy.cc/article/data-structures-for-beginners-arrays-hashmaps-and-lists)
  - [logN的由来](n.bing.com/?toHttps=1&redig=54178BEC83A640CE878C8B4736F9C008)
  - [各种算法结构演示](https://visualgo.net/zh)
  - [前端算法-git](https://juejin.im/post/5d5b307b5188253da24d3cd1?utm_source=gold_browser_extension)
  - [前端算法-docs](http://www.conardli.top/docs/dataStructure/%E4%BA%8C%E5%8F%89%E6%A0%91/%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C.html#%E6%A0%91%E6%9F%A5%E6%89%BE)
  - [小浩算法](https://geekxh.com)
  - [leetcode原题详解-历史目录](https://mp.weixin.qq.com/s/JUBHDr5T7-UPTSDaJGGfaA)

## 目录
<details>
<summary>展开更多</summary>

* [`总纲`](#总纲)
* [`时间复杂度`](#时间复杂度)
* [`树`](#树)
* [`链表`](#链表)
* [`dp`](#dp)
* [`回溯`](#回溯)
* [`BFS`](#BFS)
* [`二分查找`](#二分查找)
* [`滑动窗口`](#滑动窗口)
* [`习题`](#习题)

</details>

---

## 总纲

### 基础数据结构
> 只有两种：**数组**（顺序存储）和**链表**（链式存储）
>
> 队列、栈、哈希表扩展自数组
>
> 树、堆、图扩展自链表

### 线性非线性

线性: for/while/forEach

非线性: 递归

---

## 时间复杂度

### 常用的JS 数组内置函数

**O(1)**

- array.push
- array.pop
- array.shift

**O(n)**

- array.unshift
- array.slice
- array.splice
- 数组中查找/删除某个元素

**O(logn)**

- 二叉搜索


### 复杂度计算 - 推导大O阶
- 子问题个数乘以解决一个子问题需要的时间
- 用常数1来取代运行时间中所有加法常数。
- 修改后的运行次数函数中，只保留最高阶项
- 如果最高阶项存在且不是1，则去除与这个项相乘的常数。

### 复杂度对比
```
O(1) < O(logn) < O(n) < O(nlogn) < O(n²) < O(n³) < O(2ⁿ) < O(n!)
```

---

## 树
详见[二叉树](./二叉树.js)

### 概念
1. 每个节点最多有两个子树
2. 第n层最多有2^n个节点
3. n层最多有2^0 + 2^1 + ... + 2^n = 2^n+1 - 1个节点
4. n叉树即为`ast`

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

#### 树查找

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

#### 二分查找

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

**二叉树节点访问顺序**

![二叉树节点访问顺序](./二叉树节点访问顺序.png)

三种遍历方法(人工)得到的结果分别是：

先序：1 2 4 6 7 8 3 5
中序：4 7 6 8 2 1 3 5
后序：7 8 6 4 2 5 3 1

#### 先序遍历
> 考察到一个节点后，即刻输出该节点的值，并继续遍历其左右子树。(根左右)

![先序遍历](./先序遍历.png)

[参考](#先序遍历实现)

#### 中序遍历
> 考察到一个节点后，将其暂存，遍历完左子树后，再输出该节点的值，然后遍历右子树。(左根右)

[参考](#中序遍历实现)

#### 后序遍历
> 考察到一个节点后，将其暂存，遍历完左右子树后，再输出该节点的值。(左右根)

[参考](#后序遍历实现)

### 对称二叉树

### 平衡二叉树

---

## 链表

### 概念
- 用一组任意存储的单元来存储线性表的数据元素
- 一个对象存储着本身的值和下一个元素的地址

### 结构
[参考](./structure/链表.js)

---

## dp
- [子序列问题模板](https://www.cnblogs.com/labuladong/p/12320381.html)

### 三大要素
- 重叠子问题
- 最优子结构
- 状态转移方程

### 破解步骤
1. 明确 base case，即满足题设条件的值
2. 明确「状态」，即原/子问题中会变化的变量，一般是总量
3. 明确「选择」，即引起状态发生变化的变量
4. 定义 dp 数组/函数的含义

### 方程

**子序列思路**

```c++
int n = array.length;
int[] dp = new int[n];

for (int i = 1; i < n; i++) {
    for (int j = 0; j < i; j++) {
        dp[i] = 最值(dp[i], dp[j] + ...)
    }
}
```

**两个子串/数组思路**

```c++
int n = arr.length;
int[][] dp = new dp[n][n];

for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        if (arr[i] == arr[j]) 
            dp[i][j] = dp[i][j] + ...
        else
            dp[i][j] = 最值(...)
    }
}
```

**通用思路**

```c++
for 状态1 in 状态1的所有取值：
    for 状态2 in 状态2的所有取值：
        for ...
            dp[状态1][状态2][...] = 择优(选择1，选择2...)
```

---

## 遍历方式

### 先序遍历实现
```js
var preorderTraversal = function (root) {
  const result = [];
  const stack = [];
  let current = root;
  while (current || stack.length > 0) {
    while (current) {
      result.push(current.val);
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    current = current.right;
  }
  return result;
};
```

### 中序遍历实现
```js
var inorderTraversal = function (root) {
  const result = [];
  const stack = [];
  let current = root;
  while (current || stack.length > 0) {
    // 左子树优先入栈
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    result.push(current.val);
    // 右节点再入栈
    current = current.right;
  }
  return result;
};
```

### 后序遍历实现
```js
var postorderTraversal = function (root) {
  const result = [];
  const stack = [];
  let last = null; // 标记上一个访问的节点
  let current = root;
  while (current || stack.length > 0) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack[stack.length - 1];
    if (!current.right || current.right == last) {
      current = stack.pop();
      result.push(current.val);
      last = current;
      current = null; // 继续弹栈
    } else {
      current = current.right;
    }
  }
  return result;
}
```

---

## 回溯
> 即dfs

```python
result = []
def backtrack(路径, 选择列表):
  if 满足结束条件:
    result.add(路径)
    return
  for 选择 in 选择列表:
    track.push(选择) // 做选择
    backtrack(路径, 选择列表)
    track.pop() // 撤销选择
```

---

## BFS

```c++
// 计算从起点 start 到终点 target 的最近距离
int BFS(Node start, Node target) {
  Queue<Node> q; // 核心数据结构
  Set<Node> visited; // 避免走回头路

  q.push(start); // 将起点加入队列
  visited.add(start);
  int step = 0; // 记录扩散的步数

  while (q not empty) {
      int sz = q.size();
      /* 将当前队列中的所有节点向四周扩散 */
      for (int i = 0; i < sz; i++) {
          Node cur = q.shift();
          /* 划重点：这里判断是否到达终点 */
          if (cur is target)
              return step;
          /* 将 cur 的相邻节点加入队列 */
          for (Node x : cur.adj())
              if (x not in visited) {
                  q.push(x);
                  visited.add(x);
              }
      }
      /* 划重点：更新步数在这里 */
      step++;
  }
}
```

---

## 二分查找
```c++
int binarySearch(int[] nums, int target) {
    int left = 0, right = ...;

    while(...) {
        int mid = left + (right - left) >> 1;
        if (nums[mid] == target) {
            ...
        } else if (nums[mid] < target) {
            left = ...
        } else if (nums[mid] > target) {
            right = ...
        }
    }
    return ...;
}
```

---

## 滑动窗口

```c++
void slidingWindow(string s, string t) {
    unordered_map<char, int> need = {}, window = {};
    for (char c : t) need[c]++;

    int left = 0, right = 0;
    int valid = 0; 
    while (right < s.size()) {
        // c 是将移入窗口的字符
        char c = s[right];
        // 右移窗口
        right++;
        // 进行窗口内数据的一系列更新
        ...

        /*** debug 输出的位置 ***/
        printf("window: [%d, %d)\n", left, right);
        /********************/

        // 判断左侧窗口是否要收缩
        while (window needs shrink) {
            // d 是将移出窗口的字符
            char d = s[left];
            // 左移窗口
            left++;
            // 进行窗口内数据的一系列更新
            ...
        }
    }
}
```

---

## 习题
[目录](./leetcode/README.md)