/**
 * 题目：
 * 
 * 回溯-洗牌算法
 * 
 * 关键点：
 * 保证数字交换（洗牌）必须有 n! 种可能结果
 * 
 * 比如：
 * 5张牌，需要保证有 5*4*3*2*1 种可能结果
 * 
 */

const randInt = (min, max) => Math.ceil(min + (max - min) * Math.random());

// 遍历
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

// 回溯
function shuffle(nums) {
  const { length } = nums;
  const backtrack = (start) => {
    if (start >= length) return;
    const randomIndex = start + (Math.random() * (length - start)) >> 0;
    let tmp = nums[start];
    nums[start] = nums[randomIndex];
    nums[randomIndex] = tmp;
    backtrack(start + 1);
  };
  backtrack(0);
  return nums;
}

const arr = Array.from({ length: 54 }).fill(1).map((v, i) => v + i);
console.log(shuffle(arr));
