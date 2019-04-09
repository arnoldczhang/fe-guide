/**
 * 
 * 2. 动态规划
 * 将一个问题拆成几个子问题，分别求解这些子问题，即可推断出大问题的解
 * 
 * =特性=
 * - 无后效性
 * =》未来与过去无关（一旦f(n)确定，“我们如何凑出f(n)”就再也用不着了）
 *
 * - 最优子结构
 * =》大问题的最优解可以由小问题的最优解推出
 * 
 */


/**
 * 例1：身上带了足够的1、5、10、20、50、100元面值的钞票。
 * 现在您的目标是凑出某个金额w，需要用到尽量少的钞票
 * 
 */
function getResult(max, combination = [1, 2, 5]) {
  const f = { 0: 0 };
  const offset = Math.max(...combination);
  for (let i = 1; i <= max - offset; i += 1) {
    let cost = Infinity;
    // if (i > 1) cost = Math.min(cost, f[i - 1] + 1);
    // if (i > 2) cost = Math.min(cost, f[i - 2] + 1);
    // if (i > 5) cost = Math.min(cost, f[i - 5] + 1);
    combination.forEach((num) => {
      if (i >= num) {
        cost = Math.min(cost, f[i - num] + 1);
      }
    });
    f[i] = cost;
    combination.forEach((num) => {
      f[i + num] = cost + 1;
    });
  }
  return f;
};

// test
// console.log(getResult(15));


/**
 * 例2：最长递增子序列
 */
function getLIS(list = []) {
  const f = {};
  const len = list.length;
  for (let i = 1; i <= len; i += 1) {
    f[i] = 1;
    for (let j = 1; j < i; j += 1) {
      if (list[i] > list[j]) {
        f[i] = Math.max(f[i], f[j] + 1);
      }
    }
  }

  if (list[len - 1] > list[len - 2]) {
    f[len] = f[len - 1] + 1;
  }
  return f;
};

// test
// console.log(getLIS([1,5,3,4,6,9,7,8]));

/**
 * 例3：数字三角形
 * @param  {[type]} triangle [description]
 * @return {[type]}          [description]
 */
function getMathTriangle(triangle) {
  const f = {};
  const len = triangle.length;
  for (let i = 0; i < len; i += 1) {
    f[i] = (f[i - 1] || 0) + Math.min(...triangle[i]);
  }
  return f[len - 1];
};

function getMathTriangle2(triangle) {
  const f = {};
  const len = triangle.length;
  for (let i = 0; i < len; i += 1) {
    f[i] = Infinity;
    for (let j = 0; j < triangle[i].length; j += 1) {
      f[i] = Math.min(f[i], triangle[i][j]);
    }
    f[i] += (f[i - 1] || 0);
  }
  return f[len - 1];
};

// test
// console.log(getMathTriangle([
//   [2],
//   [3,4],
//   [6,5,7],
//   [4,1,8,3]
// ]));
// console.log(getMathTriangle2([
//   [2],
//   [3,4],
//   [6,5,7],
//   [4,1,8,3]
// ]));

/**
 *
 * 例4：背包问题（考虑价值）
 * 
 */
function knapsack(max, items = [1, 2, 4, 12], values = [50, 10, 5, 20]) {
  const itemLen = items.length;
  const sum = new Array(itemLen + 1).fill(null);
  const use = [];
  // 可选物为纵坐标
  for (let i = 0; i <= itemLen; i += 1) {
    sum[i] = [];
    use[i] = 0;
    // 0 - max，即可放空间为横坐标
    for (let j = 0; j <= max; j += 1) {
      if(i == 0 || j == 0){
        sum[i][j] = 0;
      }
    }
  }

  items.unshift(0);
  values.unshift(0);

  for (let i = 1; i <= itemLen; i += 1) {
    for (let j = 1; j <= max; j += 1) {
      if (j < items[i]) {
        sum[i][j] = sum[i - 1][j];
      } else {
        // 上个物件在这个档位的重量 对比 上个物件+当前物件的重量，取大值
        // 如果不考虑价值，这里values改为items即可
        sum[i][j] = Math.max(sum[i - 1][j], sum[i - 1][j - items[i]] + values[i]);
      }
    }
  }

  let j = max;
  // 求出哪几个物品被放入
  for(let i = itemLen; i > 0; i--){
    if (sum[i][j] > sum[i - 1][j]) {
      use[i] = 1;
      j -= items[i];
    }
  }
  use.shift();
  // return use;
  return sum;
};

// test
console.log(knapsack(15));



