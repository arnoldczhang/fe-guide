/**
 * 题目：
 * 
 * 洗牌算法
 * 
 * 关键点：
 * 保证数字交换（洗牌）必须有 n! 种可能结果
 * 
 * 比如：
 * 5张牌，需要保证有 5*4*3*2*1 种可能结果
 * 
 */

const randInt = (min, max) => Math.ceil(min + (max - min) * Math.random(), 10);

function shuffle(array) {
  const { length } = array;
  for (let i = 0 ; i < length; i++) {
      const rand = randInt(i, length - 1);
      const temp = array[i];
      array[i] = array[rand];
      array[rand] = temp;
  }
  return array;
}

const arr = Array.from({ length: 54 }).fill(1).map((v, i) => v + i);
console.log(shuffle(arr));
