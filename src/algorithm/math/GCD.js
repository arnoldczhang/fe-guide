// 欧几里得算法

/**
 * 
 * 找最大公约数
 * 
 * @param  {[type]} num1 [description]
 * @param  {[type]} num2 [description]
 * @return {[type]}      [description]
 *
 * 概念：
 * 两个数的最大公约数，也是两数差值的最大公约数
 * 
 */
function findGcd(num1, num2) {
  const num1Gcd = Math.abs(num1);
  const num2Gcd = Math.abs(num1);

  return !num2Gcd
    ? num1Gcd
    :  findGcd(num2Gcd, num1Gcd % num2Gcd);
};
