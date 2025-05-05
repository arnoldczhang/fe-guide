# 常用算法与数据结构

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
- [各种常见限流算法](https://www.wdbyte.com/java/rate-limiter.html#%E5%89%8D%E8%A8%80)
- [labuladong算法站](https://labuladong.github.io/algo/)
- [hello 算法](https://www.hello-algo.com/)

## 目录

<details>
<summary>展开更多</summary>

* [`总纲`](#总纲)
* [`时间复杂度`](#时间复杂度)
* [`1. 普通数组`](#普通数组)
* [`2. 链表`](#链表)
* [`3. 哈希`](#哈希)
* [`4. 栈`](#栈)
* [`5. 树`](#二叉树)
* [`6. 回溯`](#回溯)
* [`7. 二分查找`](#二分查找)
* [`8. 双指针`](#双指针)
* [`9. 滑动窗口`](#滑动窗口)
* [`10. 贪心算法`](#贪心算法)
* [`11. 动态规划`](#dp)
* [`bfs`](#BFS)
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

## 普通数组

> 

### 习题

- [普通数组-最大子数组和](./leetcode/普通数组-最大子数组和.js)
- [普通数组-合并区间](./leetcode/普通数组-合并区间.js)
- [普通数组-轮转数组](./leetcode/普通数组-轮转数组.js)
- [普通数组-除自身以外数组的乘积](./leetcode/普通数组-除自身以外数组的乘积.js)

---

## 二叉树

> **结构**：value、left、right
> 
> **空间复杂度**：
> 
> - dfs - O(h)
> 
> - bfs - O(w)
> 
> **遍历方式**：
> 
> - [先序遍历](#先序遍历实现)：考察到一个节点后，即刻输出该节点的值，并继续遍历其左右子树，即广度优先。
>   
>   - **访问顺序**：根节点 → 左子树 → 右子树
> 
> - [中序遍历](#中序遍历实现)：考察到一个节点后，将其暂存，遍历完左子树后，再输出该节点的值，然后遍历右子树，即深度遍历。
>   
>   - **访问顺序**：左子树 → 根节点 → 右子树
> 
> - [后序遍历](#后序遍历实现)：考察到一个节点后，将其暂存，遍历完左右子树后，再输出该节点的值，即深度优先。
> 
> **解题思路**：
> 
> - 分治：后序遍历，问题不断分解为left和right问题
> 
> - 回溯：先序遍历，处理完当层问题，再解决下层

### 模板

### 习题

- [二叉树-中序遍历](./leetcode/二叉树-中序遍历.js)
- [二叉树-最大深度](./leetcode/二叉树-最大深度.js)
- [二叉树-翻转二叉树](./leetcode/二叉树-翻转二叉树.js)
- [二叉树-对称二叉树](./leetcode/二叉树-对称二叉树.js)
- [二叉树-二叉树直径](./leetcode/二叉树-二叉树直径.js)
- [二叉树-层序遍历](./leetcode/二叉树-层序遍历.js)
- [二叉树-有序数组转为二叉搜索树](./leetcode/二叉树-有序数组转为二叉搜索树.js)
- [二叉树-验证二叉搜索树](./leetcode/二叉树-验证二叉搜索树.js)
- [二叉树-二叉搜索树第K小的元素](./leetcode/二叉树-二叉搜索树第K小的元素.js)
- [二叉树-二叉树的右视图](./leetcode/二叉树-二叉树的右视图.js)
- [二叉树-二叉树展开为链表](./leetcode/二叉树-二叉树展开为链表.js)
- [二叉树-从前序和中序遍历构造二叉树](./leetcode/二叉树-从前序和中序遍历构造二叉树.js)

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

---

## 链表

> **节点结构**：
> 
> - 数据：value
> 
> - 指针：pre、next
> 
> - 头尾指针：head、tail
> 
> **适用场景**：
> 
> - 高频插入删除：操作栈、队列
> 
> - 动态数据：内存、文件系统
> 
> - 算法问题：LRU、大数相加

### 模板

```js
class Node {
    constructor() {
        this.value = null;
        this.pre = null;
        this.next = null;
    }
}


class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
}
```

### 习题

- [链表-相交链表](./leetcode/链表-相交链表.js)
- [链表-反转链表](./leetcode/链表-反转链表.js)
- [链表-回文链表](./leetcode/链表-回文链表.js)
- [链表-环形链表](./leetcode/链表-环形链表.js)
- [链表-环形链表2](./leetcode/链表-环形链表2.js)
- [链表-合并两个有序链表](./leetcode/链表-合并两个有序链表.js)
- [链表-两数相加](./leetcode/链表-两数相加.js)
- [链表-删除链表的倒数第N个结点](./leetcode/链表-删除链表的倒数第N个结点.js)
- [链表-两两交换链表中的节点](./leetcode/链表-两两交换链表中的节点.js)
- [链表-随机链表的复制](./leetcode/链表-随机链表的复制.js)
- [链表-排序链表](./leetcode/链表-排序链表.js)
- [链表-LRU缓存](./leetcode/链表-LRU缓存.js)

---

## dp

> **理念**：识别子问题 + 设计状态转移方程
> 
> **核心思路**：
> 
> - **dp含义**：总量是i，最小/少是dp[i]
> 
> - **递推公式**：子问题如何推到出更大问题的解，比如dp[i] = dp[i - 1] + dp[i - 2] + ...
> 
> - **初始化状态**：dp[0] = 0、dp[1] = 1等
> 
> - **遍历顺序**：Math.max(...dp[n])
> 
> - **打印结果**：dp[i]

### 习题

- [dp-爬楼梯](./leetcode/dp-爬楼梯.js)
- [dp-杨辉三角](./leetcode/dp-杨辉三角.js)
- [dp-打家劫舍](./leetcode/dp-打家劫舍.js)
- [dp-完全平方数](./leetcode/dp-完全平方数.js)
- [dp-零钱兑换](./leetcode/dp-零钱兑换.js)
- [dp-单词拆分](./leetcode/dp-单词拆分.js)
- [dp-最长递增子序列长度](./leetcode/dp-最长递增子序列长度.js)
- [dp-乘积最大子数组](./leetcode/dp-乘积最大子数组.js)
- [dp-最长回文子串](./leetcode/dp-最长回文子串.js)

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

## 哈希

> **特性**：键值存储，常用于两数之和、统计次数、memorize
> 
> **数据类型**：Map、Set 
> 
> **时间复杂度**：O(1)

### 习题

- [哈希-两数之和](./leetcode/哈希-两数之和.js)
- [哈希-字母异位词分组](./leetcode/哈希-字母异位词分组.js)
- [哈希-最长连续序列](./leetcode/哈希-最长连续序列.js)

---

## 栈

> **特性**：只能在栈顶push和pop，遵循**后进先出**
> 
> **时间复杂度**：O(1)
> 
> **边界条件**：空栈、栈溢出（无限递归）

### 习题

- [栈-有效的括号](./leetcode/栈-有效的括号.js)
- [栈-最小栈](./leetcode/栈-最小栈.js)
- [栈-字符串解码](./leetcode/栈-字符串解码.js)
- [栈-每日温度](./leetcode/栈-每日温度.js)

---

## 回溯

> 即dfs
> 
> **目标**：在**决策树**中穷举所有可能性
> 
> **路径选择**：
> 
> - 选择：每步一个选择
> 
> - 递归：当前选择进入下个回溯
> 
> - 撤销：回退上个状态，尝试其他可能性
> 
> **循环条件**：
> 
> - 起始点统一，循环体在回溯函数内
> 
> - 起始点不统一，循环体包在回溯函数外
> 
> **终止条件**：当前路径满足条件，保存结果，返回
> 
> **剪枝**：预排除不满足条件的分支

### 模板

```javascript
function backtrack(路径, 选择列表) {
    if (满足终止条件) {
        保存结果;
        return;
    }

    for (const 选择 of 选择列表) {
        if (当前选择不合法) continue; // 剪枝

        做选择;      // 将选择加入路径
        backtrack(路径, 新选择列表); // 递归
        撤销选择;    // 从路径中移除选择（回溯）
    }
}
```

### 习题

- [回溯-拨电话](./leetcode/回溯-拨电话.js)
- [回溯-全排列](./leetcode/回溯-全排列.js)
- [回溯-子集](./leetcode/回溯-子集.js)
- [回溯-组合总和](./leetcode/回溯-组合总和.js)
- [回溯-括号生成](./leetcode/回溯-括号生成.js)
- [回溯-单词搜索](./leetcode/回溯-单词搜索.js)
- [回溯-分割回文串](./leetcode/回溯-分割回文串.js)

---

## 二分查找

> **前提条件**：数组必须有序
> 
> **确定边界**：初始化左右指针，left=0，right=数组length - 1
> 
> **循环缩小范围**：
> 
> - 中间元素：mid = left + (right - left ) >> 1
> 
> - 匹配到目标值：返回index
> 
> - 目标值小于中间元素：left = mid + 1
> 
> - 目标值大于中间元素：right = mid - 1
> 
> **循环条件**：
> 
> - left和right同时+1-1移动时：left <= right
> 
> - left和right某个+1-1移动时：left < right
> 
> **终止条件**：left > right

### 习题

- [二分-搜索插入位置](./leetcode/二分-搜索插入位置.js)

- [二分-搜索二维矩阵](./leetcode/二分-搜索二维矩阵.js)

- [二分-在排序数组中查找元素的第一个和最后一个位置](./leetcode/二分-在排序数组中查找元素的第一个和最后一个位置.js)

- [二分-搜索旋转排序数组](./leetcode/二分-搜索旋转排序数组.js)

- [二分-寻找旋转排序数组中的最小值](./leetcode/二分-寻找旋转排序数组中的最小值.js)

- [二分-寻找两个正序数组的中位数](./leetcode/二分-寻找两个正序数组的中位数.js)

---

## 双指针

> **类型**：
> 
> - 同向指针：快慢指针同速移动
> 
> - 反向指针：收尾向中间移动
> 
> - 快慢指针：快慢指针以不同速移动（比如2倍）
> 
> **特点**：适合线性、有序（或部分有序）的数据结构
> 
> **空间复杂度优化**：O(n) -> O(1)

### 习题

- [双指针-移动零](./leetcode/双指针-移动零.js)
- [双指针-盛最多水的容器](./leetcode/双指针-盛最多水的容器.js)
- [双指针-三数之和](./leetcode/双指针-三数之和.js)

---

## 贪心算法

> **理念**：每一步都是当前最优解，合起来是全局最优解
> 
> **适用场景**：排序好的数组、遍历

### 习题

- [贪心算法-买卖股票最佳时机](./leetcode/贪心算法-买卖股票最佳时机.js)
- [贪心算法-跳跃游戏](./leetcode/贪心算法-跳跃游戏.js)
- [贪心算法-跳跃游戏2](./leetcode/贪心算法-跳跃游戏2.js)

---

## 滑动窗口

> **定义**：用left和right表示窗口的左右边界
> 
> **移动策略**：
> 
> - 扩大窗口：right不断右移，直至窗口满足条件
> 
> - 收缩窗口：left不断右移，直至窗口不再满足条件
> 
> **状态存储**：哈希
> 
> **注意点**：
> 
> - 有可变窗口和固定窗口
> 
> - 剪支、边界

### 模板

```js
function slideWindow(字符串, 目标) {
    let left = 0;
    let right = 0;
    let len = 字符串.length;
    const result = 结果;
    while (right < len) {
        right++;
        while (满足条件) {
            记录结果
            left++;
        }
    }
    return 结果;
}
```

### 习题

- [滑动窗口-无重复字符的最长子串](./leetcode/滑动窗口-无重复字符的最长子串.js)
- [滑动窗口-找到字符串中所有字母异位词](./leetcode/滑动窗口-找到字符串中所有字母异位词.js)

---

## 习题

[目录](./leetcode/README.md)