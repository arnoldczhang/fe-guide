// 位运算

/**
 * 位与1，奇数返回1
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
const isEven = num => !(num & 1);

/**
 * 获取数在位移之后的末尾值
 * @param  {[type]} num      [description]
 * @param  {Number} position [description]
 * @return {[type]}          [description]
 */
const getBit = (num, position = 0) => (num >> position) & 1;

/**
 * 第一位是0，说明是正数
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
const isPositive = (num) => {
  if (num === 0) {
    return false;
  }

  return getBit(num, 32) === 0;
};

/**
 * 位左移*2
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
const multiplyWithByTwo  = num => num << 1;

/**
 * [description]
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
const divideByTwo = num => num >> 1;

/**
 * 取反（~表示取反减一）
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
const switchSign = num => ~num + 1;

/**
 * 有符号数乘积
 *
 * @param  {[type]} num1 [description]
 * @param  {[type]} num2 [description]
 * @return {[type]}      [description]
 *
 * tips：
 * 
 * 0 if a is zero or b is zero or both a and b are zeroes
 * 2a * (b/2)            if b is even
 * 2a * (b - 1)/2 + a    if b is odd and positive
 * 2a * (b + 1)/2 - a    if b is odd and negative
 * 
 */
const multiply = (num1, num2) => {
  if (!num1 || !num2) {
    return 0;
  }

  const multiNum1 = multiplyWithByTwo(num1);
  if (isEven(num2)) {
    return multiply(multiNum1, divideByTwo(num2));
  }

  if (isPositive(num2)) {
    return multiply(multiNum1, divideByTwo(num2 - 1)) + num1;
  }
  return multiply(multiNum1, divideByTwo(num2 + 1)) - num1;
};

// console.log(multiply(2, 18));
// console.log(multiply(2, -18));

/**
 * 无符号数乘积
 * @param  {[type]} num1 [description]
 * @param  {[type]} num2 [description]
 * @return {[type]}      [description]
 *
 *tips：
 *
 * x * 19 = x * 2^4 + x * 2^1 + x * 2^0
 * 
 */
const multiplyUnsigned = (num1, num2) => {
  if (num2 < 0) {
    num2 = switchSign(num2);
    num1 *= -1;
  }
  let result = 0;
  let num2Multi = num2;
  let index = 0;
  while(num2Multi) {
    if (num2Multi & 1) {
      result += num1 << index;
    }

    index += 1;
    num2Multi >>= 1;
  }
  return result;
};

// console.log(multiplyUnsigned(2, 18));
// console.log(multiplyUnsigned(2, -18));


