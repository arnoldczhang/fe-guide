// 斐波那契

/**
 * 返回fib数组
 * @param  {Number} n [description]
 * @return {[type]}   [description]
 */
function fibonacci(n = 1) {
  const result = [1];
  while (n-- > 1) {
    const len = result.length;
    result[len] = (result[len - 1] || 0) + (result[len - 2] || 0);
  }
  return result;
};

// test
// console.log(fibonacci(10));

/**
 * 返回第n位的fib值
 * @param  {[type]} n [description]
 * @return {[type]}   [description]
 */
function fibonacciN(n = 1) {
  if (n <= 1) return 1;
  let result = 1;
  let pre = 0;
  while (n-- > 1) {
    result += pre;
    pre = result - pre;
  }
  return result;
};

// test
// console.log(fibonacciN(10)); // 55

