// 快速算次方
const { isEven, divideByTwo } = require('./bit');

/**
 * [fasePower description]
 * @param  {[type]} base     [description]
 * @param  {[type]} exponent [description]
 * @return {[type]}          [description]
 *
 * 概念
 *
 * X^Y = X^(Y/2) * X^(Y/2) 
 * X^Y = X^(Y//2) * X^(Y//2) * X
 * 
 */
function fasePower(base, exponent) {
  if (!exponent) return 1;
  if (exponent <= 1) return base;
  const extra = isEven(exponent) ? 1 : base;
  const half = divideByTwo(exponent);
  const multiplier = fasePower(base, half);
  return multiplier * multiplier * extra;
};

// test
// console.log(fasePower(2, 5));  // 32
// console.log(fasePower(3, 5));  // 243
// console.log(fasePower(3, 4));  // 81