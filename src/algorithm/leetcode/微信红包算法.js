const toFixed = (amount = 0) => Number(amount.toFixed(2));

/**
 * 微信红包算法
 * 
 * - 最小金额：0.01
 * - 最大金额：剩余金额 / 剩余红包数量的2倍
 * - 在最大最小金额之间取一个随机数作为红包的金额
 * - 只剩一个红包时，剩余金额就是该值
 * 
 * @param {*} amount 
 * @param {*} user 
 * @returns 
 */
const redPacket = (amount = 0, user = 0) => {
  const result = [];
  let max = (amount / (user - result.length)) * 2;
  let min = 0.01;
  while (amount > 0) {
    if (result.length === user - 1) {
      result.push(amount);
      amount = 0;
      continue;
    }
    let item = max * Math.random();
    item = toFixed(item < min ? min : item);
    result.push(item);
    amount = toFixed(amount - item);
    max = amount / (user - result.length) * 2;
  }
  return result;
};

// test
console.log(redPacket(100, 10));
