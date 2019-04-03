
/**
 * 范围内素数筛选算法
 * @param  {[type]} max [description]
 * @return {[type]}     [description]
 *
 * 思路
 * 遍历 + n*n非素数
 * 
 */
function sieveOfEratosthenes(max) {
  const prime = [];
  const isPrime = new Array(max + 1).fill(true);
  for (let i = 2; i <= max; i += 1) {
    if (isPrime[i]) {
      prime.push(i);
    }

    let next = i * i;
    while (next <= max) {
      isPrime[next] = false;
      next += i;
    }
  }
  return prime;
};

console.log(sieveOfEratosthenes(120));