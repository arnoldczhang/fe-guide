/**
 * 题目：
 * 字符串相乘 
 * 
 * 题解：
 * - 记住：num1[i] 和 num2[j] 的乘积对应的就是 dp[i+j] 和 dp[i+j+1] 这两个位置
 * - 乘积结果是两位数，不足补零
 */
function multiply(num1, num2) {
  const { length: l1 } = num1;
  const { length: l2 } = num2;
  if (!l1 || !l2) return '0';
  const dp = new Array(l1 + l2).fill(0);
  for (let i = l1 - 1; i >= 0; i -= 1) {
    const v1 = num1[i];
    for (let j = l2 - 1; j >= 0; j -= 1) {
      const v2 = num2[j];
      const mul = v1 * v2;
      const sum = dp[i + j + 1] + mul;
      dp[i + j + 1] = sum % 10;
      dp[i + j] += sum / 10 >> 0;
    }
  }
  while (dp[0] === 0) {
    dp.shift();
  }
  return dp.length ? dp.join('') : '0';
}

console.log(multiply('123', '456'));