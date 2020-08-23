/**
 * 题目：
 * 
 * dp-斐波那契
 * 
 * 当前数是前两个数之和，比如：1、1、2、3、5、8、13、21、34
 * 
 * 题解：
 * - 时间复杂度在O(n)，即子问题数和输入规模成正比
 * - 缓存中间计算结果
 * 
 */
function fib(n, cach = { 1: 1, 2: 1 }) {
  if (cach[n]) return cach[n];
  if (n === 1 || n === 2) return 1;
  cach[n] = fib(n - 2, cach) + fib(n - 1, cach);
  return cach[n];
}

fib(10);