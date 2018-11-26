# js常用算法与数据结构

## 参考
  - [算法教程](https://github.com/trekhleb/javascript-algorithms/blob/master/README.zh-CN.md)
  - [数据结构Array、HashMap 与 List](https://mp.weixin.qq.com/s/zY78mB6eMQBtzMqSSaldlQ)
  - [数据结构Array、HashMap 与 List(原文)](https://www.zcfy.cc/article/data-structures-for-beginners-arrays-hashmaps-and-lists)
  - [logN的由来](n.bing.com/?toHttps=1&redig=54178BEC83A640CE878C8B4736F9C008)

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



