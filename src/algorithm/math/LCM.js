/**
 * 求最小公倍数
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 *
 * 思路
 * lcm(a, b) = |a * b| / gcd(a, b)
 * 
 */
const gcd = require('./GCD');

function lcm(num1, num2) {
  return (!num1 || !num2) ? 0 : num1 * num2 / gcd(num1, num2);
};

console.log(lcm(4, 6));

