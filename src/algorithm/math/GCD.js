// 欧几里得算法

/**
 * 
 * 最大公约数
 * 
 * @param  {[type]} num1 [description]
 * @param  {[type]} num2 [description]
 * @return {[type]}      [description]
 *
 * 思路
 * 两个数的最大公约数，也是两数差值的最大公约数
 * 
 */
function gcd(num1, num2) {
  const num1Gcd = Math.abs(num1);
  const num2Gcd = Math.abs(num2);

  return !num2Gcd
    ? num1Gcd
    : gcd(num2Gcd, num1Gcd % num2Gcd);
};

module.exports = gcd;

// test
// console.log(gcd(15, 7)); // 1
// console.log(gcd(21, 7)); // 7
